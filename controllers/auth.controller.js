const db = require('../models')
const config = require('../config/auth.config')
const {
    user: User,
    role: Role,
    refreshToken: RefreshToken,
    company: Company,
} = db

const Op = db.Sequelize.Op

const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { slackApp } = require('../connectors/slack')

exports.signup = async (req, res) => {
    // Save User to Database
    const companyId = await getCompanyId(req)
    const slackId = await getSlackId(req)
    try {
        const newUser = await User.create({
            username: req.body.username,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, 8),
            companyId: companyId,
            slackId: slackId,
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
            console.log(user)
            res.status(500).send({ message: error.message })
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
