const db = require('../models')
const GoogleController = require('./google.controller')
const { googleAuth: GoogleAuth, workload: Workload } = db
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
    eventHour: 0.4,
    sentMail: 0.2,
    inboxMail: 0.15,
    unreadMail: 0.15,
    importantMail: 0.1,
}

const ranges = {
    eventHour: [
        [0, 2],
        [2, 4],
        [4, 6],
        [6, 8],
        [8, 10],
        [10, Infinity],
    ],
    sentMail: [
        [0, 11],
        [11, 21],
        [21, 31],
        [31, 41],
        [41, 51],
        [51, Infinity],
    ],
    inboxMail: [
        [0, 21],
        [21, 41],
        [41, 61],
        [61, 81],
        [81, 101],
        [101, Infinity],
    ],
    unreadMail: [
        [0, 11],
        [11, 21],
        [21, 31],
        [31, 41],
        [41, 51],
        [51, Infinity],
    ],
    importantMail: [
        [0, 6],
        [6, 11],
        [11, 16],
        [16, 21],
        [21, 26],
        [26, Infinity],
    ],
}

const scores = [10, 8, 6, 4, 2, 0]

exports.storeDailyWorkloadStats = async () => {
    try {
        const googleUsers = await GoogleAuth.findAll()

        if (googleUsers.length === 0) {
            console.log('no google users found')
        } else {
            googleUsers.forEach(async (user) => {
                const totalMeetingDurationInHours = new Promise(
                    (resolve, reject) => {
                        eventList(user.userId)
                            .then((res) => {
                                resolve(res)
                            })
                            .catch((err) => {
                                reject(err)
                            })
                    }
                )
                const sendMessages = new Promise((resolve, reject) => {
                    messageCount(user.userId, emailLabel.SENT)
                        .then((res) => {
                            resolve(res)
                        })
                        .catch((err) => {
                            reject(err)
                        })
                })

                const inboxMessages = new Promise((resolve, reject) => {
                    messageCount(user.userId, emailLabel.INBOX)
                        .then((res) => {
                            resolve(res)
                        })
                        .catch((err) => {
                            reject(err)
                        })
                })
                const unreadMessages = new Promise((resolve, reject) => {
                    messageCount(user.userId, emailLabel.UNREAD)
                        .then((res) => {
                            resolve(res)
                        })
                        .catch((err) => {
                            reject(err)
                        })
                })
                const importantMessages = new Promise((resolve, reject) => {
                    messageCount(user.userId, emailLabel.IMPORTANT)
                        .then((res) => {
                            resolve(res)
                        })
                        .catch((err) => {
                            reject(err)
                        })
                })

                Promise.all([
                    // keep specific order
                    totalMeetingDurationInHours,
                    sendMessages,
                    inboxMessages,
                    unreadMessages,
                    importantMessages,
                ]).then(async (result) => {
                    console.log(result)
                    if (result) {
                        const dailyWorkloadScore =
                            await calculateWorkloadScore(result)

                        console.log(dailyWorkloadScore)
                        // console.log(
                        //     moment
                        //         .utc('2024-07-30 06:50:33')
                        //         .local()
                        //         .format('YYYY-MM-DD HH:mm:ss')
                        // )

                        const dailyWorkloadStat = await Workload.create({
                            hoursOfMeetings: result[0],
                            sentMail: result[1],
                            inboxMail: result[2],
                            unreadMail: result[3],
                            importantMail: result[4],
                            workloadScore: dailyWorkloadScore,
                            userId: user.userId,
                        })

                        return dailyWorkloadStat
                    }
                })
            })
        }
    } catch (error) {
        console.log('error', error)
    }
}

function getScore(value, category) {
    const categoryRanges = ranges[category]
    for (let i = 0; i < categoryRanges.length; i++) {
        if (value >= categoryRanges[i][0] && value < categoryRanges[i][1]) {
            return scores[i]
        }
    }
    return 0
}

async function calculateWorkloadScore(stats) {
    const categories = [
        'eventHour',
        'sentMail',
        'inboxMail',
        'unreadMail',
        'importantMail',
    ]
    const score = categories.reduce((totalScore, category, index) => {
        const statScore = getScore(stats[index], category)
        return totalScore + statScore * weights[category]
    }, 0)
    return score
}

async function messageCount(userId, labelId) {
    try {
        const getDailyMessageCount =
            await GoogleController.getDailyMessageCount(
                userId,
                labelId,
                queryGetDate()
            )
        return getDailyMessageCount.resultSizeEstimate
    } catch (error) {
        console.log('getDailyMessageCount error', error)
    }
}

async function eventList(userId) {
    const start = moment().startOf('day').toISOString()
    const end = moment().endOf('day').toISOString()

    try {
        const getDailyEvents = await GoogleController.getDailyCalendarEvent(
            userId,
            start,
            end
        )

        if (getDailyEvents.length === 0) {
            return 0
        }

        // Calculate total duration in milliseconds
        const totalDurationInMs = getDailyEvents
            .filter(
                (event) =>
                    event.status === 'confirmed' &&
                    event.start?.dateTime &&
                    event.end?.dateTime
            )
            .reduce((accumulator, event) => {
                const startTime = moment(event.start.dateTime)
                const endTime = moment(event.end.dateTime)
                return accumulator + endTime.diff(startTime)
            }, 0)

        // Convert milliseconds to hours
        return totalDurationInMs / (1000 * 60 * 60)
    } catch (error) {
        console.error('Error fetching daily events:', error)
        return 0
    }
}
function queryGetDate() {
    // Get the start and end of the day using moment and convert to Unix timestamps directly
    const startOfDayTimestamp = moment().startOf('day').unix()
    const endOfDayTimestamp = moment().endOf('day').unix()

    // Formulate the query
    const query = `after:${startOfDayTimestamp} before:${endOfDayTimestamp}`
    return query
}
