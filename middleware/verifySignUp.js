const db = require('../models')
const ROLES = db.ROLES
const User = db.user
const COMPANY = db.company

const checkDuplicateUsernameOrEmail = (req, res, next) => {
    // Email
    User.findOne({
        where: {
            email: req.body.email,
        },
    }).then((user) => {
        if (user) {
            res.status(400).send({
                message: 'Failed! Email is already in use!',
            })
            return
        }

        next()
    })
}

const checkRolesExisted = (req, res, next) => {
    if (req.body.roles) {
        for (let i = 0; i < req.body.roles.length; i++) {
            if (!ROLES.includes(req.body.roles[i])) {
                res.status(400).send({
                    message:
                        'Failed! Role does not exist = ' + req.body.roles[i],
                })
                return
            }
        }
    }

    next()
}

const checkCompanyExisted = (req, res, next) => {
    if (req.body.email) {
        const domain = req.body.email.split('@')
        COMPANY.findOne({
            where: {
                domain: domain[1],
                status: 1,
            },
        }).then((company) => {
            if (!company) {
                res.status(400).send({
                    message: 'Failed! This company not registered !',
                })
                return
            }

            next()
        })
    }
}

const verifySignUp = {
    checkDuplicateUsernameOrEmail: checkDuplicateUsernameOrEmail,
    checkRolesExisted: checkRolesExisted,
    checkCompanyExisted: checkCompanyExisted,
}

module.exports = verifySignUp
