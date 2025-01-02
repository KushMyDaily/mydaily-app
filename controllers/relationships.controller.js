const db = require('../models')
const GoogleController = require('./google.controller')
const { googleAuth: GoogleAuth, user: User, relationship: Relationship } = db
const moment = require('moment')

const emailLabel = Object.freeze({
    INBOX: 'INBOX',
    SPAM: 'SPAM',
    TRASH: 'TRASH',
    UNREAD: 'UNREAD',
    STARRED: 'STARRED',
    IMPORTANT: 'IMPORTANT',
    SENT: 'SENT',
    DRAFT: 'DRAFT',
})

const weights = {
    meetingAttendees: 0.45,
    oneToOneManager: 0.4,
    emailRecipients: 0.15,
}

const ranges = {
    meetingAttendees: [
        [15, Infinity],
        [12, 14],
        [9, 11],
        [5, 8],
        [2, 4],
        [0, 1],
    ],
    oneToOneManager: [
        [5, Infinity],
        [4, 4],
        [3, 3],
        [2, 2],
        [1, 1],
        [0, 0],
    ],
    emailRecipients: [
        [30, Infinity],
        [25, 29],
        [20, 24],
        [15, 19],
        [10, 14],
        [0, 9],
    ],
}

const scores = [10, 8, 6, 4, 2, 0]

exports.storeReleationshipsStats = async () => {
    try {
        const googleUsers = await GoogleAuth.findAll()

        if (googleUsers.length === 0) {
            console.log('no google users found')
        } else {
            googleUsers.forEach(async (user) => {
                const numberOfMeetingAttendees = new Promise(
                    (resolve, reject) => {
                        eventAttendeesList(user.userId)
                            .then((res) => {
                                resolve(res)
                            })
                            .catch((err) => {
                                reject(err)
                            })
                    }
                )
                const oneToOneManager = new Promise((resolve, reject) => {
                    eventOneToOneManagerList(user.userId)
                        .then((res) => {
                            resolve(res)
                        })
                        .catch((err) => {
                            reject(err)
                        })
                })
                const numberOfEmailRecipients = new Promise(
                    (resolve, reject) => {
                        emailRecipients(user.userId, emailLabel.SENT)
                            .then((res) => {
                                resolve(res)
                            })
                            .catch((err) => {
                                reject(err)
                            })
                    }
                )
                Promise.all([
                    // keep specific order
                    numberOfMeetingAttendees,
                    oneToOneManager,
                    numberOfEmailRecipients,
                ]).then(async (result) => {
                    const relationshipScore =
                        await calculateRelationshipScore(result)
                    console.log(
                        '==============================================='
                    )
                    console.log('=== user', user.userId)
                    console.log('=== Relationship result', result)
                    console.log('=== Relationship score', relationshipScore)
                    console.log(
                        '==============================================='
                    )

                    const relationshipStat = await Relationship.create({
                        meetingAttendees: result[0] || 0,
                        oneToOneManager: result[1] || 0,
                        emailRecipients: result[2] || 0,
                        relationshipScore: relationshipScore,
                        userId: user.userId,
                    })

                    return relationshipStat
                })
            })
        }
    } catch (error) {
        console.log('relationship stat issue ', error)
    }
}

function getScore(value, category) {
    const categoryRanges = ranges[category]
    for (let i = 0; i < categoryRanges.length; i++) {
        if (value >= categoryRanges[i][0] && value <= categoryRanges[i][1]) {
            return scores[i]
        }
    }
    return 0
}

async function calculateRelationshipScore(stats) {
    const categories = [
        'meetingAttendees',
        'oneToOneManager',
        'emailRecipients',
    ]
    const score = categories.reduce((totalScore, category, index) => {
        const statScore = getScore(stats[index], category)
        return totalScore + statScore * weights[category]
    }, 0)
    const roundedScore = parseFloat(score.toFixed(2))
    return roundedScore
}

async function eventAttendeesList(userId) {
    const lastFiveWorkingDays = getLastWorkingDays(20)
    const start = lastFiveWorkingDays[0].startDate
    const end = lastFiveWorkingDays[19].endDate

    try {
        const getDailyEvents = await GoogleController.getDailyCalendarEvent(
            userId,
            start,
            end
        )

        if (getDailyEvents.length === 0) {
            return 0
        }

        const eventAttendeesCount = getDailyEvents.reduce(
            (accumulator, event) => {
                const attendeesCount = event?.attendees?.length || 0
                return accumulator + attendeesCount
            },
            0
        )

        return eventAttendeesCount
    } catch (error) {
        console.error('Error fetching daily events:', error)
        return 0
    }
}

async function eventOneToOneManagerList(userId) {
    const lastFiveWorkingDays = getLastWorkingDays(20)
    const start = lastFiveWorkingDays[0].startDate
    const end = lastFiveWorkingDays[19].endDate

    try {
        const getDailyEvents = await GoogleController.getDailyCalendarEvent(
            userId,
            start,
            end
        )

        if (getDailyEvents.length === 0) {
            return 0
        }

        // Fetch manager emails
        const user = await User.findByPk(userId, {
            include: {
                model: User,
                as: 'Managers',
                attributes: ['email'],
            },
        })

        const managerEmails =
            user?.Managers?.map((manager) => manager.email) || []

        // Filter events based on manager emails
        const filteredEvents = getDailyEvents.map((event) => {
            const filteredAttendees = event?.attendees?.filter((attendee) =>
                managerEmails.includes(attendee.email)
            )

            return {
                ...event,
                manager: filteredAttendees,
            }
        })

        // Count events with manager attendees
        const oneToOneManagerCount = filteredEvents.filter(
            (item) => item.manager?.length > 0 && item.attendees?.length < 3
        ).length

        return oneToOneManagerCount
    } catch (error) {
        console.error('eventOneToOneManagerList error:', error)
        return 0
    }
}

async function emailRecipients(userId, labelId) {
    const lastFiveWorkingDays = getLastWorkingDays(20)
    const start = moment(lastFiveWorkingDays[0].startDate).unix()
    const end = moment(lastFiveWorkingDays[19].endDate).unix()

    const query = `after:${start} before:${end}`
    try {
        const getDailyMessageDetails =
            await GoogleController.getDailyMessageDetails(
                userId,
                labelId,
                query
            )

        if (getDailyMessageDetails) {
            const filteredRecipients = getDailyMessageDetails.reduce(
                (accumulator, message) => {
                    message?.payload?.headers.forEach((header) => {
                        if (header.name === 'To' && header.value) {
                            const emailString = header?.value
                            const emailArray = emailString
                                .split(',')
                                .map((email) => email.trim())
                            accumulator = accumulator + emailArray?.length
                        }
                    })
                    return accumulator
                },
                0
            )
            return filteredRecipients
        }
        return 0
    } catch (error) {
        console.log('getDailyEmailRecipient error', error)
        return 0
    }
}

function getLastWorkingDays(count) {
    const workingDays = []
    let day = moment()

    while (workingDays.length < count) {
        day = day.subtract(1, 'days') // Move to the previous day
        const dayOfWeek = day.isoWeekday()

        // Add to the array if it's a weekday (Monday to Friday)
        if (dayOfWeek !== 6 && dayOfWeek !== 7) {
            workingDays.push({
                date: day.format('YYYY-MM-DD'),
                startDate: day.startOf('day').toISOString(),
                endDate: day.endOf('day').toISOString(),
            })
        }
    }

    // Sort the workingDays array in ascending order by startDate
    workingDays.sort((a, b) => {
        return moment(a.startDate).diff(moment(b.startDate))
    })

    return workingDays
}
