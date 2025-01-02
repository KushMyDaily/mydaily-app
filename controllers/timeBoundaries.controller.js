const db = require('../models')
const GoogleController = require('./google.controller')
const { googleAuth: GoogleAuth, timeBoundaries: TimeBoundaries } = db
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
    outsideWorkHours: 0.6,
    conflictMeetings: 0.1,
    emailSentOutside: 0.3,
}

const ranges = {
    outsideWorkHours: [
        [0, 0],
        [1, 2],
        [3, 4],
        [5, 6],
        [7, 8],
        [9, Infinity],
    ],
    conflictMeetings: [
        [0, 0],
        [1, 2],
        [3, 4],
        [5, 6],
        [7, 8],
        [9, Infinity],
    ],
    emailSentOutside: [
        [0, 10],
        [11, 20],
        [21, 30],
        [31, 40],
        [41, 50],
        [51, Infinity],
    ],
}

const scores = [10, 8, 6, 4, 2, 0]

exports.storetimeBoundariesStats = async () => {
    try {
        const googleUsers = await GoogleAuth.findAll()

        if (googleUsers.length === 0) {
            console.log('no google users found')
        } else {
            googleUsers.forEach(async (user) => {
                const EventScheduledOutsideHours = new Promise(
                    (resolve, reject) => {
                        eventOutsideWorkHours(user.userId)
                            .then((res) => {
                                resolve(res)
                            })
                            .catch((err) => {
                                reject(err)
                            })
                    }
                )
                const EventsConflicting = new Promise((resolve, reject) => {
                    eventsConflicting(user.userId)
                        .then((res) => {
                            resolve(res)
                        })
                        .catch((err) => {
                            reject(err)
                        })
                })
                const NumberOfEmailOutsideHours = new Promise(
                    (resolve, reject) => {
                        emailOutsideHours(user.userId, emailLabel.SENT)
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
                    EventScheduledOutsideHours,
                    EventsConflicting,
                    NumberOfEmailOutsideHours,
                ]).then(async (result) => {
                    const timeBoundariesScore =
                        await calculateTimeBoundariesScore(result)
                    console.log(
                        '==============================================='
                    )
                    console.log('=== user', user.userId)
                    console.log('=== TimeBoundaries result', result)
                    console.log('=== TimeBoundaries score', timeBoundariesScore)
                    console.log(
                        '==============================================='
                    )

                    const timeBoundariesStat = await TimeBoundaries.create({
                        outsideWorkHours: result[0] || 0,
                        conflictMeetings: result[1] || 0,
                        emailSentOutside: result[2] || 0,
                        timeBoundariesScore: timeBoundariesScore,
                        userId: user.userId,
                    })

                    return timeBoundariesStat
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

async function calculateTimeBoundariesScore(stats) {
    const categories = [
        'outsideWorkHours',
        'conflictMeetings',
        'emailSentOutside',
    ]
    const score = categories.reduce((totalScore, category, index) => {
        const statScore = getScore(stats[index], category)
        return totalScore + statScore * weights[category]
    }, 0)
    const roundedScore = parseFloat(score.toFixed(2))
    return roundedScore
}

async function eventOutsideWorkHours(userId) {
    const lastFiveWorkingDays = getLastWorkingDays(5)
    const start = lastFiveWorkingDays[0].startDate
    const end = lastFiveWorkingDays[4].endDate

    try {
        const getLastWorkingDaysEvents =
            await GoogleController.getDailyCalendarEvent(userId, start, end)

        if (getLastWorkingDaysEvents.length === 0) {
            return 0
        }

        const eventOutsideCount = getLastWorkingDaysEvents.reduce(
            (accumulator, event) => {
                let startOutsideHours = false
                let endOutsideHours = false
                if (event?.start?.dateTime) {
                    const start = event?.start
                    startOutsideHours = isEventOutsideBusinessHours(
                        start.dateTime,
                        start.timeZone,
                        8,
                        17
                    ) // 8 AM to 5 PM
                }

                if (event?.start?.dateTime) {
                    const end = event?.end
                    endOutsideHours = isEventOutsideBusinessHours(
                        end.dateTime,
                        end.timeZone,
                        8,
                        17
                    ) // 8 AM to 5 PM
                }

                if (startOutsideHours || endOutsideHours) {
                    accumulator = accumulator + 1
                }
                return accumulator
            },
            0
        )

        return eventOutsideCount
    } catch (error) {
        console.error('Error fetching daily events:', error)
        return 0
    }
}
async function eventsConflicting(userId) {
    const lastFiveWorkingDays = getLastWorkingDays(5)
    const start = lastFiveWorkingDays[0].startDate
    const end = lastFiveWorkingDays[4].endDate

    try {
        const getLastWorkingDaysEvents =
            await GoogleController.getDailyCalendarEvent(userId, start, end)
        if (getLastWorkingDaysEvents.length === 0) {
            return 0
        }

        const conflictMeetingCount = await findConflicts(
            getLastWorkingDaysEvents
        )
        return conflictMeetingCount
    } catch (error) {
        console.error('Error fetching last working days events:', error)
        return 0
    }
}
async function emailOutsideHours(userId, labelId) {
    const lastFiveWorkingDays = getLastWorkingDays(5)
    const start = moment(lastFiveWorkingDays[0].startDate).unix()
    const end = moment(lastFiveWorkingDays[4].endDate).unix()

    const query = `after:${start} before:${end}`

    try {
        const getLastWorkingDaysMessage =
            await GoogleController.getDailyMessageDetails(
                userId,
                labelId,
                query
            )

        const emailOutsideCount = getLastWorkingDaysMessage?.reduce(
            (accumulator, message) => {
                if (message?.internalDate) {
                    const emailOutside = isEmailOutsideBusinessHours(
                        message?.internalDate,
                        8,
                        17
                    )
                    if (emailOutside) {
                        accumulator = accumulator + 1
                    }
                }
                return accumulator
            },
            0
        )
        return emailOutsideCount || 0
    } catch (error) {
        console.log('getEmailOutsideHours error', error)
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

function isEventOutsideBusinessHours(dateTime, timeZone, startHour, endHour) {
    const time = moment.tz(dateTime, timeZone)

    // Get the start and end times for the same day as dateTime in the given timezone
    const startTime = moment(time)
        .startOf('day')
        .hour(startHour)
        .minute(0)
        .second(0)
    const endTime = moment(time)
        .startOf('day')
        .hour(endHour)
        .minute(0)
        .second(0)

    // Check if the time is outside the range
    return !time.isBetween(startTime, endTime, null, '[)')
}

function isEmailOutsideBusinessHours(internalDate, startHour, endHour) {
    if (internalDate) {
        // Convert the internalDate from milliseconds to a moment object
        const emailDateTime = moment(parseInt(internalDate))

        // Check if the email time is outside work hours
        if (
            emailDateTime.hour() < startHour ||
            emailDateTime.hour() >= endHour
        ) {
            return true
        }
    }
    return false
}

function findConflicts(events) {
    // Filter events that have at least one attendee
    const filteredEvents = events.filter(
        (event) => event.attendees && event.attendees.length > 0
    )

    // Sort events by start time
    const sortedEvents = filteredEvents.sort((a, b) => {
        return new Date(a.start.dateTime) - new Date(b.start.dateTime)
    })

    // Use reduce to count overlapping events
    const { conflicts } = sortedEvents.reduce(
        (acc, event, index, array) => {
            if (index === 0) {
                acc.lastEndTime = new Date(event.end.dateTime)
                return acc
            }

            const currentStartTime = new Date(event.start.dateTime)
            if (acc.lastEndTime > currentStartTime) {
                acc.conflicts++
            }

            acc.lastEndTime = new Date(event.end.dateTime)
            return acc
        },
        { conflicts: 0, lastEndTime: null }
    )

    return conflicts
}
