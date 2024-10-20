const db = require('../models')
const config = require('../config/auth.config')
const {
    user: User,
    role: Role,
    refreshToken: RefreshToken,
    company: Company,
    workspaceUser: WorkspaceUser,
} = db

const Op = db.Sequelize.Op

const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const nodemailer = require('nodemailer')
const crypto = require('crypto')
const { slackApp } = require('../connectors/slack')

exports.signup = async (req, res) => {
    // Save User to Database
    const companyId = await getCompanyId(req)
    const slackId = await getSlackId(req)
    const workspaceUserIds = await getWorkspaceUserIds(req.body.email)

    try {
        const newUser = await User.create({
            username: req.body.username,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, 8),
            companyId: companyId,
            slackId: slackId,
            workspaceUserIds: workspaceUserIds,
        })
        if (newUser) {
            if (req.body.roles) {
                await Role.findAll({
                    where: {
                        name: {
                            [Op.or]: req.body.roles,
                        },
                    },
                }).then((roles) => {
                    newUser.setRoles(roles).then(() => {
                        res.send({ message: 'User registered successfully!' })
                    })
                })
            } else {
                // user role = 1
                await newUser.setRoles([1]).then(() => {
                    res.send({ message: 'User registered successfully!' })
                })
            }
        } else {
            console.log('New user creation empty')
        }
    } catch (error) {
        res.status(500).send({ message: error.message })
    }
}

exports.signin = (req, res) => {
    User.findOne({
        where: {
            email: req.body.email,
        },
    })
        .then(async (user) => {
            if (!user) {
                return res.status(404).send({ message: 'User Not found.' })
            }

            const passwordIsValid = bcrypt.compareSync(
                req.body.password,
                user.password
            )

            if (!passwordIsValid) {
                return res.status(401).send({
                    accessToken: null,
                    message: 'Invalid Password!',
                })
            }

            const token = jwt.sign({ id: user.id }, config.secret, {
                expiresIn: config.jwtExpiration,
            })

            let refreshToken = await RefreshToken.createToken(user)

            let authorities = []
            user.getRoles().then((roles) => {
                for (let i = 0; i < roles.length; i++) {
                    authorities.push('ROLE_' + roles[i].name.toUpperCase())
                }

                const userData = {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    companyId: user.companyId,
                    workspaceUserIds: user.workspaceUserIds,
                }

                res.status(200).send({
                    id: user.id,
                    user: userData,
                    roles: authorities,
                    accessToken: token,
                    refreshToken: refreshToken,
                })
            })
        })
        .catch((err) => {
            res.status(500).send({ message: err.message })
        })
}

exports.refreshToken = async (req, res) => {
    const { refreshToken: requestToken } = req.body

    if (requestToken == null) {
        return res.status(403).json({ message: 'Refresh Token is required!' })
    }

    try {
        let refreshToken = await RefreshToken.findOne({
            where: { token: requestToken },
        })

        if (!refreshToken) {
            res.status(403).json({
                message: 'Refresh token is not in database!',
            })
            return
        }

        if (RefreshToken.verifyExpiration(refreshToken)) {
            RefreshToken.destroy({ where: { id: refreshToken.id } })

            res.status(403).json({
                message:
                    'Refresh token was expired. Please make a new signin request',
            })
            return
        }

        const user = await refreshToken.getUser()
        let newAccessToken = jwt.sign({ id: user.id }, config.secret, {
            expiresIn: config.jwtExpiration,
        })

        return res.status(200).send({
            accessToken: newAccessToken,
            refreshToken: refreshToken.token,
        })
    } catch (err) {
        return res.status(500).send({ message: err })
    }
}

exports.signOut = async (req, res) => {
    const { refreshToken } = req.body
    RefreshToken.destroy({ where: { token: refreshToken } })

    return res.status(200).json({
        message: 'You logged out successfully.',
    })
}

const getCompanyId = async (req) => {
    let companyId = null
    const domain = req.body.email.split('@')
    if (domain) {
        await Company.findOne({
            where: {
                domain: domain[1],
            },
        })
            .then((company) => {
                companyId = company.id
            })
            .catch(() => {
                companyId = null
            })
        return companyId
    }
}

const getSlackId = async (req) => {
    let salckId = null
    await slackApp.client.users
        .lookupByEmail({
            email: req.body.email,
        })
        .then((slackuser) => {
            salckId = slackuser.user?.id
        })
        .catch((error) => {
            salckId = null
        })
    return salckId
}

const getWorkspaceUserIds = async (email) => {
    if (email) {
        let workspaceUserId = null
        await WorkspaceUser.findAll({
            where: { email: email },
        })
            .then(async (workspaceUser) => {
                if (workspaceUser.length > 1) {
                    const userIds = workspaceUser.map((user) => user.id)
                    workspaceUserId = userIds
                } else if (workspaceUser.length === 1) {
                    workspaceUserId = await workspaceUser[0].id
                } else {
                    workspaceUserId = null
                }
            })
            .catch((error) => {
                console.log(error)
                workspaceUserId = null
            })
        return workspaceUserId
    } else {
        console.log('signup user email issue')
        return null
    }
}

exports.fogotPassword = async (req, res) => {
    const { email } = req.body
    // Check if the email exists in your user database
    if (email) {
        await User.findOne({
            where: { email: email },
        })
            .then(async (user) => {
                if (user) {
                    // Generate a reset token
                    const token = crypto.randomBytes(20).toString('hex')
                    // Store the token with the user's email in a database or in-memory store
                    await User.update(
                        {
                            resetToken: token,
                        },
                        {
                            where: {
                                email: user.email,
                            },
                        }
                    )
                    const transporter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                            user: process.env.APP_MANAGE_EMAIL,
                            pass: process.env.APP_MANAGE_PASSWORD,
                        },
                    })
                    const mailOptions = {
                        from: process.env.APP_MANAGE_EMAIL,
                        to: email,
                        subject: 'Password Reset mydaily account',
                        text: `Hello ${user.username}, Click the following link to reset your password: ${process.env.URL_LOCAL}/resetPassword/${token}`,
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
                                data: 'Please check your emails for instructions on how to reset your password',
                            })
                        }
                    })
                } else {
                    return res.status(404).send({
                        message:
                            'That you requested email have not in our database',
                    })
                }
            })
            .catch((error) => {
                return res.status(404).send({
                    message:
                        'That you requested email have not in our database',
                })
            })
    } else {
        return res.status(404).send({ message: 'Email Not found.' })
    }
}

// Route to update the password
exports.updatePassword = async (req, res) => {
    const { token } = req.params
    const { password } = req.body

    if (token && password) {
        await User.findOne({
            where: { resetToken: token },
        })
            .then(async (user) => {
                if (user) {
                    const updatedUser = await User.update(
                        {
                            password: bcrypt.hashSync(password, 8),
                            resetToken: null,
                        },
                        {
                            where: {
                                email: user.email,
                            },
                        }
                    )

                    if (updatedUser) {
                        await res.status(200).send({
                            message: 'Password reset sucessfully completed',
                        })
                    }
                } else {
                    console.log(error)
                    res.status(404).send({
                        message: 'Invalid or expired token',
                    })
                }
            })
            .catch((error) => {
                console.log(error)
                res.status(404).send({ message: 'Invalid or expired token' })
            })
    } else {
        res.status(404).send({ message: 'Token or password issue' })
    }
}
