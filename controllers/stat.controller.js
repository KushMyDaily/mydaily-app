const db = require('../models')
const moment = require('moment')
const {
    surveyAnswer: SurveyAnswer,
    workload: Workload,
    timeBoundaries: TimeBoundaries,
    relationship: Relationship,
    autonomy: Autonomy,
    communications: Communications,
    statisticsByDate: StatisticsByDate,
    user: User,
} = db
const { Op, Sequelize } = require('sequelize')

const dailyAverageWeight = [
    0.16, 0.14, 0.13, 0.12, 0.1, 0.08, 0.06, 0.05, 0.04, 0.03, 0.03, 0.02, 0.02,
    0.01, 0.01,
]

const factors = [
    'WORKLOAD',
    'TIMEBOUNDARY',
    'RELATIONSHIP',
    'AUTONOMY',
    'COMMUNICATION',
]

const workloadSurveyIds = [1, 2, 3, 4]
const timeBoundarySurveyIds = [5, 6, 7, 8]
const relationshipSurveyIds = [9, 10, 11, 12]
const autonomySurveyIds = [13, 14, 15, 16]
const communicationSurveyIds = [17, 18, 19, 20]

function getSurveyIds(category) {
    switch (category) {
        case 'WORKLOAD':
            return workloadSurveyIds
        case 'TIMEBOUNDARY':
            return timeBoundarySurveyIds
        case 'RELATIONSHIP':
            return relationshipSurveyIds
        case 'AUTONOMY':
            return autonomySurveyIds
        case 'COMMUNICATION':
            return communicationSurveyIds
        default:
            return [] // or handle unknown category
    }
}
//stressfactors
async function getStressfactors(req, res) {
    const { userId, date } = req.body

    if (!userId) {
        return res.status(401).json({ error: 'User is required' })
    }
    if (!date) {
        return res.status(401).json({ error: 'Date is required' })
    }
    const startOfDay = new Date(date)
    const endOfDay = new Date(date)
    endOfDay.setUTCHours(23, 59, 59, 999) // Set to the end of the day

    try {
        const latestStat = await StatisticsByDate.findOne({
            where: {
                userId: userId,
                createdAt: {
                    [Op.between]: [
                        startOfDay.toISOString(),
                        endOfDay.toISOString(),
                    ],
                },
            },
            order: [['createdAt', 'DESC']],
        })
        console.log(latestStat)
        return res.status(200).send({ data: latestStat })
    } catch (error) {
        console.error('Error fetching latest statistics:', error)
        return res.status(401).json({ error: error })
    }
}

//wellBeing
async function getWellBeingRelatedData(req, res) {
    const { userId, date } = req.body

    if (!userId) {
        return res.status(401).json({ error: 'User is required' })
    }
    if (!date) {
        return res.status(401).json({ error: 'Date is required' })
    }
    const endDate = moment(date).endOf('day').toDate() // Ending on the given date
    const startDate = moment(date).subtract(30, 'days').startOf('day').toDate() // 30 days back from the given date

    // Fetch records for the last 30 days for the given user
    const dataSet = await StatisticsByDate.findAll({
        where: {
            userId: userId,
            createdAt: {
                [Op.between]: [startDate, endDate],
            },
        },
        order: [['createdAt', 'DESC']], // Order by latest date
        attributes: [
            'id',
            'workload',
            'relationship',
            'timeBoundaries',
            'autonomy',
            'communication',
            'yourForm',
            'createdAt',
        ], // Select only the required fields to optimize
    })

    if (dataSet && date) {
        const yourform = await findResultsByDate(dataSet, date)
        const average = await getAverages(dataSet, date)

        const result = {
            yourForm: (yourform.length > 0 && yourform[0].yourForm) || 0,
            formAverageLast30Days: average.formAverageLast30Days || 0,
            stressFactorAverageLast30Days:
                average.stressFactorAverageLast30Days || 0,
            formAverageAllData: average.formAverageAllData || 0,
            stressFactorAverageAllData: average.stressFactorAverageAllData || 0,
        }
        return res.status(200).send({ data: result })
    } else {
        const result = {
            yourForm: 0,
            formAverageLast30Days: 0,
            stressFactorAverageLast30Days: 0,
            formAverageAllData: 0,
            stressFactorAverageAllData: 0,
        }
        return res.status(200).send({ data: result })
    }
}

//month by data
async function getMonthByFormData(req, res) {
    const { userId, year } = req.body
    try {
        const monthData = await generateMonthDataForYear(userId, year)
        return res.status(200).send({ data: monthData })
    } catch (error) {
        return res.status(401).json({ error: error })
    }
}

//calender data
async function getcalenderData(req, res) {
    const { userId, year } = req.body

    const startDate = moment().year(year).startOf('year').format('YYYY-MM-DD')
    const endDate = moment().year(year).endOf('year').format('YYYY-MM-DD')

    try {
        const findYearlyData = await getYearlyData(userId, startDate, endDate)
        const latestEntries = findYearlyData.reduce((acc, current) => {
            const currentDate = new Date(current.createdAt).toDateString() // Group by the date portion (ignore time)

            // If this date isn't already in the accumulator or the current entry is more recent, replace the entry
            if (
                !acc[currentDate] ||
                new Date(current.createdAt) >
                    new Date(acc[currentDate].createdAt)
            ) {
                acc[currentDate] = {
                    yourForm: current.yourForm, // Store yourForm value
                    createdAt: moment(current?.createdAt).format('YYYY-MM-DD'), // Store createdAt value
                }
            }

            return acc
        }, {})

        const resultArray = Object.values(latestEntries)
        return res.status(200).send({ data: resultArray })
    } catch (error) {
        return res.status(401).json({ error: error })
    }
}

const getYearlyData = async (userId, yearStartDate, yearEndDate) => {
    const yearlyData = await StatisticsByDate.findAll({
        where: {
            userId: userId,
            createdAt: {
                [Op.between]: [yearStartDate, yearEndDate], // Use the startDate and endDate you generate
            },
        },
        attributes: ['yourForm', 'createdAt'],
        order: [['createdAt', 'DESC']], // Order by createdAt descending
    })

    return yearlyData
}

const generateMonthDataForYear = async (userId, year) => {
    const months = moment.months() // Array of month names (January, February, etc.)
    const monthData = []

    for (let i = 0; i < 12; i++) {
        // Use moment's .set() method to ensure the date is created in ISO format
        const startDate = moment({ year: year, month: i, day: 1 })
            .startOf('month')
            .format('YYYY-MM-DD')
        const endDate = moment({ year: year, month: i, day: 1 })
            .endOf('month')
            .format('YYYY-MM-DD')
        const monthAverage = await getMonthAverage(userId, startDate, endDate)

        monthData.push({
            month: months[i], // Month name
            startDate: startDate, // Start date of the month
            endDate: endDate, // End date of the month
            yourForm: Number(monthAverage) || 0, //your form average
        })
    }

    return monthData
}

const getMonthAverage = async (userId, startDate, endDate) => {
    const averageData = await StatisticsByDate.findAll({
        where: {
            userId: userId,
            createdAt: {
                [Op.between]: [startDate, endDate], // Use the startDate and endDate you generate
            },
        },
        attributes: [
            [Sequelize.fn('AVG', Sequelize.col('yourForm')), 'avgYourForm'], // Average yourForm
        ],
        raw: true, // Optional: use raw query to return only the data values, not the Sequelize instances
    })
    if (averageData && averageData[0].avgYourForm !== null) {
        return averageData[0].avgYourForm.toFixed(2)
    }

    return 0
}

const getAverages = async (data, givenDate) => {
    const today = moment(givenDate, 'YYYY-MM-DD') // Current date
    const last30Days = moment(givenDate, 'YYYY-MM-DD').subtract(30, 'days') // 30 days ago

    // Filter data for the last 30 days
    const filteredData = data.filter((item) => {
        const createdAt = moment(item.createdAt)
        return createdAt.isBetween(last30Days, today, null, '[]') // Inclusive of today
    })

    // Calculate the average of yourform for the last 30 days
    const formAverageLast30Days =
        filteredData.length === 0
            ? 0
            : (
                  filteredData.reduce((sum, item) => sum + item.yourForm, 0) /
                  filteredData.length
              ).toFixed(2)
    // Calculate the average of wellbeing for the last 30 days
    const stressFactorAverageLast30Days =
        filteredData.length === 0
            ? 0
            : (
                  filteredData.reduce(
                      (sum, item) =>
                          sum +
                          (item.workload +
                              item.relationship +
                              item.timeBoundaries +
                              item.autonomy +
                              item.communication) /
                              5,
                      0
                  ) / filteredData.length
              ).toFixed(2)

    // Calculate the average of yourform for all available data
    const formAverageAllData = (
        data.reduce((sum, item) => sum + item.yourForm, 0) / data.length
    ).toFixed(2)

    // Calculate the average of wellbeing for all available data
    const stressFactorAverageAllData = (
        data.reduce(
            (sum, item) =>
                sum +
                (item.workload +
                    item.relationship +
                    item.timeBoundaries +
                    item.autonomy +
                    item.communication) /
                    5,
            0
        ) / data.length
    ).toFixed(2)

    return {
        formAverageLast30Days,
        stressFactorAverageLast30Days,
        formAverageAllData,
        stressFactorAverageAllData,
    }
}

const findResultsByDate = async (dataSet, specificDate) => {
    // Convert specificDate to a date object for comparison
    const targetDate = new Date(specificDate)
    // Create a start and end time for the target date
    const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0))
    const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999))

    // Filter the dataset for results that fall on the specific date
    const results = dataSet.filter((item) => {
        const createdAt = new Date(item.createdAt)
        return createdAt >= startOfDay && createdAt <= endOfDay
    })
    if (results.length > 0) {
        return results
    }
    return []
}

//Static data store
async function storeDailyStaticsData() {
    const todayDate = moment().format('YYYY-MM-DD')
    const users = await User.findAll()

    if (users) {
        users.forEach(async (user) => {
            const stressFactorScore = await getStatStressFactorsScore(
                user.id,
                todayDate
            )
            const wellBeingScore = await getStatWellBeingScore(
                user.id,
                todayDate
            )
            const yourForm = await getYourForm(user.id, todayDate)

            if (stressFactorScore && wellBeingScore) {
                console.log(stressFactorScore)
                console.log(wellBeingScore)
                console.log(yourForm)
                try {
                    await StatisticsByDate.create({
                        workload: stressFactorScore['WORKLOAD'],
                        relationship: stressFactorScore['RELATIONSHIP'],
                        timeBoundaries: stressFactorScore['TIMEBOUNDARY'],
                        autonomy: stressFactorScore['AUTONOMY'],
                        communication: stressFactorScore['COMMUNICATION'],
                        wellbeingScore: wellBeingScore,
                        yourForm: yourForm,
                        userId: user.id,
                    })
                } catch (error) {
                    console.log(error)
                    return error
                }
            }
        })
    }
}

//your form
async function getYourForm(userId, date) {
    if (!userId) {
        throw new Error('User ID is required')
    }
    if (!date) {
        throw new Error('Date is required')
    }
    const givenDate = moment(date, 'YYYY-MM-DD') // Parse the given date using Moment.js
    const fifteenDaysAgo = givenDate.clone().subtract(15, 'days') // Subtract 15 days from the given date

    try {
        const last15DaysWellbeingStats = await StatisticsByDate.findAll({
            where: {
                userId: userId,
                createdAt: {
                    [Op.between]: [
                        fifteenDaysAgo.toISOString(),
                        givenDate.toISOString(),
                    ],
                },
            },
            order: [['createdAt', 'DESC']], // Order by most recent first
        })
        if (last15DaysWellbeingStats.length !== 0) {
            const last15DaysWellbeingArray =
                await generateLast15DaysWellbeingScores(
                    last15DaysWellbeingStats,
                    date
                )
            const hasEmptyDays = last15DaysWellbeingArray.some(
                (score) => score === 0
            )
            if (hasEmptyDays) {
                const emptyValuesTotalScore = last15DaysWellbeingArray.reduce(
                    (totalScore, data, index) => {
                        if (data === 0) {
                            totalScore += dailyAverageWeight[index] || 0
                        }
                        return totalScore
                    },
                    0
                )
                if (emptyValuesTotalScore) {
                    const totalAvailableWeight = (
                        1 - emptyValuesTotalScore
                    ).toFixed(2)
                    const newWeightScore = dailyAverageWeight.map((average) =>
                        (average / totalAvailableWeight).toFixed(2)
                    )

                    const totalScore = await calculateTotalWellbeingScore(
                        last15DaysWellbeingArray,
                        newWeightScore
                    )
                    return totalScore
                }
            } else {
                const totalScore = await calculateTotalWellbeingScore(
                    last15DaysWellbeingArray,
                    dailyAverageWeight
                )
                return totalScore
            }
        }
        return 0
    } catch (error) {
        console.error('Error fetching last 15 days statistics:', error)
        return 0
    }

    async function calculateTotalWellbeingScore(
        last15DaysWellbeingArray,
        newWeightScore
    ) {
        const totalScore = last15DaysWellbeingArray.reduce(
            (sum, current, index) => {
                return sum + current * parseFloat(newWeightScore[index])
            },
            0
        )

        return totalScore.toFixed(2)
    }
}

async function generateLast15DaysWellbeingScores(data, referenceDate) {
    const result = []

    // Parse the reference date using moment.js
    const refDate = moment(getPreviousWeekday(referenceDate), 'YYYY-MM-DD')

    // Create an array of dates for the last 15 days
    const last15Days = Array.from({ length: 15 }, (_, i) =>
        refDate.clone().subtract(i, 'days').format('YYYY-MM-DD')
    )

    // Prepare a map to store the latest wellbeingScore for each date
    const latestWellbeingByDate = {}

    // Iterate through the data and store only the latest wellbeingScore for each day
    data.forEach((item) => {
        const date = moment(item.createdAt).format('YYYY-MM-DD')
        if (
            !latestWellbeingByDate[date] ||
            moment(item.createdAt).isAfter(
                latestWellbeingByDate[date].createdAt
            )
        ) {
            latestWellbeingByDate[date] = item.wellbeingScore
        }
    })

    // Populate the result array with wellbeingScore or null
    last15Days.forEach((day) => {
        if (latestWellbeingByDate[day] !== undefined) {
            result.push(latestWellbeingByDate[day])
        } else {
            result.push(0) // If no data for the day, push 0
        }
    })

    return result
}

// Function to get the last weekday from a given date
function getPreviousWeekday(date) {
    let previousDate = moment(date).subtract(1, 'days')

    // If the day is Saturday (6) or Sunday (0), adjust to the last weekday (Friday)
    if (previousDate.day() === 6) {
        // If it's Saturday, subtract 1 more day to get Friday
        previousDate = previousDate.subtract(1, 'days')
    } else if (previousDate.day() === 0) {
        // If it's Sunday, subtract 2 more days to get Friday
        previousDate = previousDate.subtract(2, 'days')
    }

    return previousDate.format('YYYY-MM-DD')
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Static data for stress factors
async function getStatStressFactorsScore(userId, date) {
    if (!userId) {
        throw new Error('User ID is required')
    }
    if (!date) {
        throw new Error('Date is required')
    }

    // Create an object to hold the results
    const results = {}

    // Use Promise.all to wait for all asynchronous operations to complete
    await Promise.all(
        factors.map(async (factor) => {
            const value = await getStat(userId, factor, date)
            results[factor] = value // Assign the result to the corresponding factor
        })
    )

    console.log(results) // Log the results object
    return results // Send the results as a JSON response
}

//Static data for well being score
async function getStatWellBeingScore(userId, date) {
    if (!userId) {
        throw new Error('User ID is required')
    }
    if (!date) {
        throw new Error('Date is required')
    }

    try {
        let totalSum = 0 // Initialize the total sum

        // Use Promise.all to wait for all asynchronous operations to complete
        await Promise.all(
            factors.map(async (factor) => {
                const value = await getStat(userId, factor, date)
                totalSum += parseFloat(value) || 0 // Accumulate the sum, ensuring to handle NaN
            })
        )

        // Calculate the average by dividing by the number of factors
        const averageFactorsScore = (totalSum / factors.length).toFixed(2) // Divide by 5

        const isFactorExist = checkFactorAccordingDate(date)
        if (isFactorExist) {
            const surveyScore = await surveyScoreCalculate(
                userId,
                getSurveyIds(isFactorExist),
                date,
                0 //Answer Type [answer 1, answer 2] use index number [0,1]
            )

            console.log(`averageFactorsScore`, averageFactorsScore)
            console.log(`surveyScore`, surveyScore)

            if (surveyScore !== 0 && surveyScore > 0) {
                const totalWellbeingScoreByDay = (
                    averageFactorsScore * 0.25 +
                    surveyScore * 0.75
                ).toFixed(2)
                return totalWellbeingScoreByDay
                // console.log(finalWorkloadScore)
                // res.status(200).json({
                //     success: true,
                //     result: finalWorkloadScore.toFixed(2),
                // })
            } else {
                return averageFactorsScore
                // console.log(integrationScore)
                // res.status(200).json({
                //     success: true,
                //     result: integrationScore.toFixed(2),
                // })
            }
        }
    } catch (error) {
        console.log(error)
        return error
    }
}

function checkFactorAccordingDate(dateString) {
    const date = new Date(dateString)
    const dayOfWeek = date.getDay()

    if (dayOfWeek >= 1 && dayOfWeek <= 5) {
        switch (dayOfWeek) {
            case 1:
                return 'WORKLOAD'
            case 2:
                return 'TIMEBOUNDARY'
            case 3:
                return 'RELATIONSHIP'
            case 4:
                return 'AUTONOMY'
            case 5:
                return 'COMMUNICATION'
            default:
                return '' // or handle unknown category
        }
    }
}

const getStat = async (userId, stressFactor, date) => {
    try {
        const integrationScore = await integrationScoreCalculate(
            userId,
            stressFactor,
            date
        )
        const surveyScore = await surveyScoreCalculate(
            userId,
            getSurveyIds(stressFactor),
            date,
            1 //Answer Type [answer 1, answer 2] use index number [0,1]
        )
        console.log(`integrationScore ${stressFactor}`, integrationScore)
        console.log(`surveyScore ${stressFactor}`, surveyScore)

        if (surveyScore !== 0 && surveyScore > 0) {
            const finalWorkloadScore =
                integrationScore * 0.25 + surveyScore * 0.75
            return finalWorkloadScore.toFixed(2)
            // console.log(finalWorkloadScore)
            // res.status(200).json({
            //     success: true,
            //     result: finalWorkloadScore.toFixed(2),
            // })
        } else {
            return integrationScore.toFixed(2)
            // console.log(integrationScore)
            // res.status(200).json({
            //     success: true,
            //     result: integrationScore.toFixed(2),
            // })
        }
    } catch (error) {
        console.error('Error calculating integration score:', error)
        // res.status(500).json({ error: 'Internal server error' })
        return 0
    }
}

const integrationScoreCalculate = async (userId, stressFactor, date) => {
    function getModal(modal) {
        switch (modal) {
            case 'WORKLOAD':
                return { modal: Workload, tableName: 'workloads' }
            case 'TIMEBOUNDARY':
                return { modal: TimeBoundaries, tableName: 'time_boundaries' }
            case 'RELATIONSHIP':
                return { modal: Relationship, tableName: 'relationships' }
            case 'AUTONOMY':
                return { modal: Autonomy, tableName: 'autonomys' }
            case 'COMMUNICATION':
                return { modal: Communications, tableName: 'communications' }
            default:
                return [] // or handle unknown category
        }
    }

    function getDynamicScore(data, scoreType) {
        switch (scoreType) {
            case 'WORKLOAD':
                return data.workloadScore
            case 'TIMEBOUNDARY':
                return data.timeBoundariesScore
            case 'RELATIONSHIP':
                return data.relationshipScore
            case 'AUTONOMY':
                return data.autonomyScore
            case 'COMMUNICATION':
                return data.communicationScore
            // Add more cases as needed
            default:
                return 0 // Default score if no type matches
        }
    }

    if (!userId) {
        throw new Error('User ID is required')
    }
    if (!date) {
        throw new Error('Date is required')
    }

    // Parse the given date
    const givenDate = new Date(date)

    // Calculate the last 15 weekdays
    const weekdays = []
    for (let i = 0; weekdays.length < 15; i++) {
        const currentDate = new Date(givenDate)
        currentDate.setDate(givenDate.getDate() - i)

        // Check if the day is a weekday (Mon-Fri)
        const day = currentDate.getDay()
        if (day !== 0 && day !== 6) {
            // 0 = Sunday, 6 = Saturday
            weekdays.push(currentDate.toISOString().split('T')[0])
        }
    }

    // Create a string of the last 15 weekdays for the SQL query
    const weekdayCondition = weekdays.map((date) => `'${date}'`).join(',')

    try {
        const entries = await getModal(stressFactor).modal.findAll({
            where: {
                userId: userId,
                createdAt: {
                    [Op.in]: Sequelize.literal(`(
                        SELECT MIN(createdAt)
                        FROM ${getModal(stressFactor).tableName}
                        WHERE userId = ${userId} 
                        AND DATE(createdAt) IN (${weekdayCondition})
                        GROUP BY DATE(createdAt)
                    )`),
                },
            },
            order: [['createdAt', 'DESC']],
        })

        const startDate = new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)
        const endDate = new Date()
        const dateArray = Array.from(
            { length: 15 },
            (_, i) =>
                new Date(endDate - i * 24 * 60 * 60 * 1000)
                    .toISOString()
                    .split('T')[0]
        )

        if (entries) {
            const result = dateArray.map((date) => {
                return (
                    entries.find(
                        (entry) =>
                            new Date(entry.createdAt)
                                .toISOString()
                                .split('T')[0] === date
                    ) || {}
                )
            })

            const hasEmptyObjects = result.some(
                (obj) => Object.keys(obj).length === 0
            )

            if (hasEmptyObjects) {
                const emptyValuesTotalScore = result.reduce(
                    (totalScore, data, index) => {
                        if (Object.keys(data).length === 0) {
                            totalScore += dailyAverageWeight[index] || 0
                        }
                        return totalScore
                    },
                    0
                )

                if (emptyValuesTotalScore) {
                    const totalAvailableWeight = (
                        1 - emptyValuesTotalScore
                    ).toFixed(2)
                    const newWeightScore = dailyAverageWeight.map((average) =>
                        (average / totalAvailableWeight).toFixed(2)
                    )

                    const totalScore = await calculateTotalScore(
                        result,
                        newWeightScore,
                        stressFactor
                    )
                    return totalScore
                }
            } else {
                return result.reduce((acc, data) => {
                    return (
                        acc +
                        (data.workloadScore || 0) *
                            (dailyAverageWeight[result.indexOf(data)] || 0)
                    )
                }, 0)
            }
        }

        return 0 // Default return if no valid score is calculated
    } catch (error) {
        console.error('Workload retrieval error:', error)
        throw new Error('Database error')
    }

    async function calculateTotalScore(result, newWeightScore, stressFactor) {
        let totalScore = 0

        for (const [dailyValueIndex, data] of result.entries()) {
            if (Object.keys(data).length !== 0) {
                const score = await getDynamicScore(data, stressFactor)
                totalScore += score * (newWeightScore[dailyValueIndex] || 0)
            }
        }

        return totalScore
    }
}

const surveyScoreCalculate = async (userId, surveyIds, date, answerType) => {
    if (!userId) {
        throw new Error('User ID is required')
    }
    if (!date) {
        throw new Error('Date is required')
    }

    if (!Array.isArray(surveyIds) || surveyIds.length === 0) {
        throw new Error('Survey IDs must be a non-empty array')
    }

    // Parse the given date
    const givenDate = new Date(date)

    // Calculate the date range for the last 30 days
    const startDate = new Date(givenDate)
    startDate.setDate(givenDate.getDate() - 30)

    try {
        const entries = await SurveyAnswer.findAll({
            where: {
                userId: userId,
                surveyId: {
                    [Op.in]: surveyIds, // Filter by survey IDs
                },
                createdAt: {
                    [Op.gte]: startDate, // Greater than or equal to 30 days ago
                    [Op.lte]: givenDate, // Less than or equal to the given date
                },
            },
            order: [['createdAt', 'DESC']], // Order by createdAt descending
            limit: 2, // Limit to the last 2 records
        })
        if (entries.length !== 2) {
            return 0 // No entries found
        }
        const score = await entries.reduce((total, entry) => {
            const answer = JSON.parse(entry.answers)
            if (!Array.isArray(answer) || answer.length < 2) {
                throw new Error('Invalid answer format')
            }
            total += answer[answerType]

            return total
        }, 0)
        const fixedScore = (score / 2).toFixed(2)

        return fixedScore
    } catch (error) {
        console.error('Error retrieving workloads:', error)
        throw new Error('Database error')
    }
}

module.exports = {
    getStatWellBeingScore: getStatWellBeingScore,
    getStatStressFactorsScore: getStatStressFactorsScore,
    storeDailyStaticsData: storeDailyStaticsData,
    getStressfactors: getStressfactors,
    getYourForm: getYourForm,
    getWellBeingRelatedData: getWellBeingRelatedData,
    getMonthByFormData: getMonthByFormData,
    getcalenderData: getcalenderData,
}
