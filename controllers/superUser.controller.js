const db = require('../models')
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
        try {
            const companyUsers = await User.findAll({
                where: {
                    companyId: companyId,
                },
            })
            const userIds = companyUsers.map((user) => user.id)

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
            res.status(200).json({
                responseRate: responseRate.toFixed(2),
                totalResponses: totalResponses,
                totalUsers: totalUsers,
            })
        } catch (error) {
            console.error('Error fetching survey response rate:', error)
            res.status(500).json({ message: 'Internal server error' })
        }
    } catch (error) {
        console.error('Error fetching survey response rate:', error)
        res.status(500).json({ message: 'Internal server error' })
    }
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
