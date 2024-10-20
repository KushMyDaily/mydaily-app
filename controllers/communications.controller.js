const db = require('../models')
const GoogleController = require('./google.controller')
const { googleAuth: GoogleAuth, communications: Communications } = db
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
    sharedCalendarEvent: 0.75,
    sendMailFrequency: 0.25,
}

const ranges = {
    sharedCalendarEvent: [
        [10, Infinity],
        [8, 9],
        [6, 7],
        [4, 5],
        [2, 3],
        [0, 1],
    ],
    sendMailFrequency: [
        [9, 10],
        [7, 8],
        [5, 6],
        [3, 4],
        [1, 2],
        [0, 0],
    ],
}

const scores = [10, 8, 6, 4, 2, 0]

exports.storeCommunicationStats = async () => {
    try {
        const googleUsers = await GoogleAuth.findAll()

        if (googleUsers.length === 0) {
            console.log('no google users found')
        } else {
            googleUsers.forEach(async (user) => {
                const numberOfSharedEvents = new Promise((resolve, reject) => {
                    eventAttendeesList(user.userId)
                        .then((res) => {
                            resolve(res)
                        })
                        .catch((err) => {
                            reject(err)
                        })
                })
                const numberOfSentMailFrequency = new Promise(
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
                    numberOfSharedEvents,
                    numberOfSentMailFrequency,
                ]).then(async (result) => {
                    const communicationScore =
                        await calculateCommunicationScore(result)
                    console.log(
                        '==============================================='
                    )
                    console.log('=== user', user.userId)
                    console.log('=== Communication result', result)
                    console.log('=== Communication score', communicationScore)
                    console.log(
                        '==============================================='
                    )

                    const communicationStat = await Communications.create({
                        sharedCalendarEvent: result[0],
                        sendMailFrequency: result[1],
                        communicationScore: communicationScore,
                        userId: user.userId,
                    })

                    return communicationStat
                })
            })
        }
    } catch (error) {
        console.log('communication stat issue ', error)
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

async function calculateCommunicationScore(stats) {
    const categories = ['sharedCalendarEvent', 'sendMailFrequency']
    const score = categories.reduce((totalScore, category, index) => {
        const statScore = getScore(stats[index], category)
        return totalScore + statScore * weights[category]
    }, 0)
    const roundedScore = parseFloat(score.toFixed(2))
    return roundedScore
}

async function eventAttendeesList(userId) {
    const lastFiveWorkingDays = getLastWorkingDays(5)
    const start = lastFiveWorkingDays[0].startDate
    const end = lastFiveWorkingDays[4].endDate

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
                if (event?.attendees?.length > 1) {
                    accumulator = accumulator + 1
                }
                return accumulator
            },
            0
        )

        return eventAttendeesCount
    } catch (error) {
        console.error('Error fetching eventAttendeesList', error)
        return 0
    }
}

async function emailRecipients(userId, labelId) {
    const lastFiveWorkingDays = getLastWorkingDays(5)
    const start = moment(lastFiveWorkingDays[0].startDate).unix()
    const end = moment(lastFiveWorkingDays[4].endDate).unix()

    const query = `after:${start} before:${end}`
    try {
        const getSendMessageDetails =
            await GoogleController.getDailyMessageDetails(
                userId,
                labelId,
                query
            )

        if (getSendMessageDetails) {
            const filteredRecipients = getSendMessageDetails.reduce(
                (accumulator, message) => {
                    if (message) {
                        accumulator = accumulator + 1
                    }
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
