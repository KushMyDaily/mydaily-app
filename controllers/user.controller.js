const db = require('../models')
const nodemailer = require('nodemailer')
const fs = require('fs')
const { promisify } = require('util')

const { workspaceUser: WorkspaceUser, googleAuth: GoogleAuth, user: User } = db
const readFileAsync = promisify(fs.readFile)

const slackStatus = Object.freeze({
    AUTHORIZED: 'AUTHORIZED',
    UNAUTHORIZED: 'UNAUTHORIZED',
    REAUTHORIZED: 'REAUTHORIZED',
    UNDEFINED: 'UNDEFINED',
})

exports.allAccess = (req, res) => {
    res.status(200).send('Public Content.')
}

exports.userBoard = (req, res) => {
    res.status(200).send('User Content.')
}

exports.adminBoard = (req, res) => {
    res.status(200).send('Admin Content.')
}

exports.moderatorBoard = (req, res) => {
    res.status(200).send('Moderator Content.')
}

exports.checkSocialAuth = async (req, res) => {
    const { userid } = req.params

    if (!userid) {
        return res.status(401).json({ error: 'User is required' })
    }

    const user = await User.findOne({ where: { id: userid } })
    if (!user) {
        return res.status(401).json({ error: 'User not found' })
    }

    if (user) {
        let hasSlack
        if (user && user.workspaceUserIds) {
            const workspaceUserIds = safeConvertToArray(user.workspaceUserIds)
            hasSlack = await checkSlackStatus(workspaceUserIds[0])
        } else {
            hasSlack = slackStatus.UNDEFINED
        }

        const googleAuthUser = await GoogleAuth.findOne({
            where: { userId: user.id },
        })
        const hasGoogle = !!googleAuthUser

        return res.status(200).send({ data: { hasSlack, hasGoogle } })
    } else {
        return res.status(401).json({ error: 'User not found' })
    }
}
async function checkSlackStatus(workspaceUser) {
    try {
        // Query to fetch OAuth data along with associated workspace user data
        const oauthData = await db.slackOAuthAccess.findAll({
            include: [
                {
                    model: WorkspaceUser,
                    through: { attributes: [] }, // Exclude intermediate table data
                    where: { id: workspaceUser }, // Filter by specific workspace user ID
                    attributes: ['id', 'name', 'email', 'isAdmin', 'isOwner'], // Adjust the fields you want from workspaceUser
                },
            ],
            attributes: [
                'id',
                'teamId',
                'botToken',
                'userToken',
                'needsReauthorization',
            ], // Adjust the fields you want from slackOAuthAccess
        })

        if (
            oauthData[0]?.needsReauthorization &&
            (oauthData[0]?.workspace_users[0]?.isAdmin ||
                oauthData[0]?.workspace_users[0]?.isOwner)
        ) {
            return slackStatus.REAUTHORIZED
        } else if (
            !oauthData[0]?.needsReauthorization &&
            (oauthData[0]?.workspace_users[0]?.isAdmin ||
                oauthData[0]?.workspace_users[0]?.isOwner)
        ) {
            return slackStatus.AUTHORIZED
        } else {
            return slackStatus.UNAUTHORIZED
        }
    } catch (error) {
        console.error('Error fetching OAuth and workspace user data:', error)
        throw error
    }
}

function safeConvertToArray(input) {
    if (!input) return [] // Return empty array for empty input

    try {
        const parsed = JSON.parse(input)
        return Array.isArray(parsed) ? parsed : [parsed]
    } catch (error) {
        return input.includes(',')
            ? input.split(',').map(Number)
            : [Number(input)]
    }
}

exports.updateProfile = async (req, res) => {
    const { userid, fullName, position, birthday, gender } = req.body

    if (!userid) {
        return res.status(401).json({ error: 'User is required' })
    }

    if (userid) {
        await User.findOne({
            where: { id: userid },
        })
            .then(async (user) => {
                if (user) {
                    const updatedUser = await User.update(
                        {
                            fullname: fullName,
                            position: position,
                            birthday: birthday,
                            gender: gender,
                        },
                        {
                            where: {
                                email: user.email,
                            },
                        }
                    )
                    if (updatedUser) {
                        return res
                            .status(200)
                            .json({ message: 'Profile updated' })
                    }
                }
            })
            .catch((error) => {
                return res.status(401).json({ error: error })
            })
    } else {
        return res.status(401).json({ error: 'User not found' })
    }
}

exports.getProfile = async (req, res) => {
    const { userid } = req.params
    if (!userid) {
        return res.status(401).json({ error: 'User is required' })
    }

    if (userid) {
        await User.findByPk(userid, {
            include: [
                {
                    model: User,
                    as: 'Managers',
                    through: { attributes: [] }, // Exclude attributes from the junction table
                },
            ],
            exclude: [
                'password',
                'companyId',
                'workspaceUserIds',
                'createdAt',
                'updatedAt',
                'resetToken',
            ],
        })
            .then(async (user) => {
                if (user) {
                    const roles = await user.getRoles() // Wait for roles to be fetched
                    const authorities = roles.map(
                        (role) => 'ROLE_' + role.name.toUpperCase()
                    )

                    const userData = user.toJSON()
                    userData.role = authorities
                    return res.status(200).send({ data: userData })
                } else {
                    return res.status(401).json({ error: 'User not found' })
                }
            })
            .catch((error) => {
                return res.status(401).json({ error: error })
            })
    } else {
        return res.status(401).json({ error: 'User not found' })
    }
}

exports.sendConcern = async (req, res) => {
    const { userId, concern } = req.body

    if (!userId) {
        return res.status(401).json({ error: 'User is required' })
    }

    if (!concern) {
        return res.status(401).json({ error: 'Concern is required' })
    }

    if (userId && concern) {
        const user = await User.findOne({ where: { id: userId } })
        if (user) {
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.APP_MANAGE_EMAIL,
                    pass: process.env.APP_MANAGE_PASSWORD,
                },
            })
            const mailOptions = {
                from: process.env.APP_MANAGE_EMAIL,
                to: 'mydaily.manage@gmail.com',
                subject: `Manager Concern from ${user.username}`,
                text: `User name: ${user.username}, Email: ${user.email}, Concern: ${concern}`,
            }
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log(error)
                    return res
                        .status(500)
                        .send({ message: 'Error sending email' })
                } else {
                    console.log(`Email sent: ${info.response}`)
                    return res.status(200).send({
                        data: 'Message sent successfully',
                    })
                }
            })
        } else {
            return res.status(401).json({ error: 'User not found' })
        }
    }
}

exports.monthlyNotification = async () => {
    // Read the HTML template and image file
    const htmlTemplate = await readFileAsync(
        'emailTemplates/monthlyNotification.html',
        'utf-8'
    )

    const users = await User.findAll({})
    if (users) {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.APP_MANAGE_EMAIL,
                pass: process.env.APP_MANAGE_PASSWORD,
            },
        })
        const mailOptions = {
            from: process.env.APP_MANAGE_EMAIL,
            to: users.email,
            subject: `Monthly Notification`,
            html: htmlTemplate,
        }
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error)
            } else {
                console.log(`Email sent: ${info.response}`)
            }
        })
    } else {
        console.log('User not found')
    }
}
