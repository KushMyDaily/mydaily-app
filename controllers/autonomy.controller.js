const db = require('../models')
const GoogleController = require('./google.controller')
const { googleAuth: GoogleAuth, autonomy: Autonomy } = db
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
    ALL: [],
})

const weights = {
    eventCreatedByUser: 0.6,
    initiatedEmailThreads: 0.4,
}

const ranges = {
    eventCreatedByUser: [
        [15, Infinity],
        [12, 14],
        [9, 11],
        [6, 8],
        [3, 5],
        [0, 2],
    ],
    initiatedEmailThreads: [
        [26, Infinity],
        [21, 25],
        [16, 20],
        [11, 15],
        [6, 10],
        [0, 2],
    ],
}

const scores = [10, 8, 6, 4, 2, 0]

exports.storeAutonomyStats = async () => {
    try {
        const googleUsers = await GoogleAuth.findAll()

        if (googleUsers.length === 0) {
            console.log('no google users found')
        } else {
            googleUsers.forEach(async (user) => {
                const noOfeventCreatedByUser = new Promise(
                    (resolve, reject) => {
                        eventCreatedByUser(user.userId)
                            .then((res) => {
                                resolve(res)
                            })
                            .catch((err) => {
                                reject(err)
                            })
                    }
                )
                const noOfinitiatedEmailThreads = new Promise(
                    (resolve, reject) => {
                        initiatedEmailThreads(user.userId, emailLabel.ALL)
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
                    noOfeventCreatedByUser,
                    noOfinitiatedEmailThreads,
                ]).then(async (result) => {
                    console.log(result)
                    const autonomyScore = await calculateAutonomyScore(result)
                    console.log(autonomyScore)

                    const autonomyStat = await Autonomy.create({
                        eventCreatedByUser: result[0],
                        initiatedEmailThreads: result[1],
                        autonomyScore: autonomyScore,
                        userId: user.userId,
                    })

                    return autonomyStat
                })
            })
        }
    } catch (error) {
        console.log('Autonomy stat issue ', error)
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

async function calculateAutonomyScore(stats) {
    const categories = ['eventCreatedByUser', 'initiatedEmailThreads']
    const score = categories.reduce((totalScore, category, index) => {
        const statScore = getScore(stats[index], category)
        return totalScore + statScore * weights[category]
    }, 0)
    const roundedScore = parseFloat(score.toFixed(2))
    return roundedScore
}

async function eventCreatedByUser(userId) {
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

        const eventCreatedByUserCount = getDailyEvents.reduce(
            (accumulator, event) => {
                if (event?.creator && event?.creator?.self) {
                    accumulator = accumulator + 1
                }
                return accumulator
            },
            0
        )

        return eventCreatedByUserCount || 0
    } catch (error) {
        console.error('Error fetching eventCreatedByUser:', error)
        return 0
    }
}

async function initiatedEmailThreads(userId, labelId) {
    const lastFiveWorkingDays = getLastWorkingDays(20)
    const start = moment(lastFiveWorkingDays[0].startDate).unix()
    const end = moment(lastFiveWorkingDays[19].endDate).unix()

    const query = `after:${start} before:${end} from:me`

    try {
        const getLastWorkingDaysThreads =
            await GoogleController.getEmailThreads(userId, labelId, query)

        const initiatedEmailThreadsCount =
            getLastWorkingDaysThreads?.resultSizeEstimate || 0
        return initiatedEmailThreadsCount
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
