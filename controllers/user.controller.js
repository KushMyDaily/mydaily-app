const db = require('../models')
const nodemailer = require('nodemailer')
const { workspaceUser: WorkspaceUser, googleAuth: GoogleAuth, user: User } = db

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
        const workspaceUser = await WorkspaceUser.findOne({
            where: { email: user.email },
        })

        const googleAuthUser = await GoogleAuth.findOne({
            where: { userId: user.id },
        })

        const hasSlack = !!workspaceUser
        const hasGoogle = !!googleAuthUser

        return res.status(200).send({ data: { hasSlack, hasGoogle } })
    } else {
        return res.status(401).json({ error: 'User not found' })
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
            .then((user) => {
                if (user) {
                    return res.status(200).send({ data: user })
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
