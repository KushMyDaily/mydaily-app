const db = require('../models')
const moment = require('moment')
const { surveyAnswer: SurveyAnswer, user: User, company: Company } = db
const { Op } = require('sequelize')

async function getSurveyResponseRate(req, res) {
    try {
        const { companyId, date } = req.body

        // Validate input
        if (!companyId || !date) {
            return res
                .status(400)
                .json({ message: 'Company ID and date are required' })
        }

        const companyUsers = await User.findAll({
            where: {
                companyId: companyId,
            },
        })

        if (!companyUsers || companyUsers.length === 0) {
            return res
                .status(404)
                .json({ message: 'No users found for the specified company' })
        }

        const userIds = companyUsers.map((user) => user.id)

        // Calculate SRR for the week
        const lastWeekdays = getLastWeekdays(date, 5)
        const lastWeekSRR = await Promise.all(
            lastWeekdays.map(async (day) => {
                try {
                    const daySRR = await calculateSRR(userIds, day)
                    return { day: day, srr: daySRR }
                } catch (error) {
                    console.error(`Error calculating SRR for ${day}:`, error)
                    return { day: day, srr: 0 }
                }
            })
        )

        res.status(200).json({
            lastDaySRR: lastWeekSRR[0]?.srr || 0,
            lastWeekSRR: lastWeekSRR,
        })
    } catch (error) {
        console.error('Error fetching survey response rate:', error)
        res.status(500).json({ message: 'Internal server error' })
    }
}
async function calculateSRR(userIds, date) {
    try {
        const entries = await SurveyAnswer.findAll({
            where: {
                createdAt: {
                    [Op.between]: [`${date} 00:00:00`, `${date} 23:59:59`],
                },
                userId: {
                    [Op.in]: userIds,
                },
            },
        })

        const totalResponses = entries.length
        const totalUsers = userIds.length
        const responseRate =
            totalUsers > 0 ? (totalResponses / totalUsers) * 100 : 0
        return responseRate.toFixed(2)
    } catch (error) {
        console.error(`Error calculating SRR for date ${date}:`, error)
        return 0 // Default response rate in case of an error
    }
}

function getLastWeekdays(referenceDate, daysCount) {
    const lastWeekdays = []
    let refDate = moment(referenceDate, 'YYYY-MM-DD').clone()

    while (lastWeekdays.length < daysCount) {
        if (refDate.isoWeekday() !== 6 && refDate.isoWeekday() !== 7) {
            lastWeekdays.push(refDate.format('YYYY-MM-DD'))
        }
        refDate.subtract(1, 'days')
    }

    return lastWeekdays
}

async function getCompanyList(req, res) {
    try {
        const companies = await Company.findAll()
        res.status(200).json(companies)
    } catch (error) {
        console.error('Error fetching company list:', error)
        res.status(500).json({ message: 'Internal server error' })
    }
}

async function getCompanyDetailsById(req, res) {
    try {
        const companyId = req.params.companyId
        if (!companyId) {
            return res.status(400).json({ message: 'Company ID is required' })
        }
        const companyDetails = await Company.findOne({
            where: { id: companyId },
            include: [
                {
                    model: User,
                    as: 'users',
                    attributes: [
                        'id',
                        'username',
                        'email',
                        'fullname',
                        'manager',
                        'birthday',
                        'position',
                    ],
                },
            ],
        })

        if (!companyDetails) {
            return res.status(404).json({ message: 'Company not found' })
        }

        res.status(200).json(companyDetails)
    } catch (error) {
        console.error('Error fetching company details:', error)
        res.status(500).json({ message: 'Internal server error' })
    }
}

module.exports = {
    getSurveyResponseRate: getSurveyResponseRate,
    getCompanyList: getCompanyList,
    getCompanyDetailsById: getCompanyDetailsById,
}
