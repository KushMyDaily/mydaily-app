const jwt = require('jsonwebtoken')
const config = require('../config/auth.config.js')
const db = require('../models')
const User = db.user

const { TokenExpiredError } = jwt

const catchError = (err, res) => {
    if (err instanceof TokenExpiredError) {
        return res
            .status(401)
            .send({ message: 'Unauthorized! Access Token was expired!' })
    }

    return res.sendStatus(401).send({ message: 'Unauthorized!' })
}

const verifyToken = (req, res, next) => {
    let token = req.headers['x-access-token']

    if (!token) {
        return res.status(403).send({ message: 'No token provided!' })
    }

    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
            return catchError(err, res)
        }
        req.userId = decoded.id
        next()
    })
}

const isUser = (req, res, next) => {
    User.findByPk(req.userId).then((user) => {
        user.getRoles().then((roles) => {
            for (let i = 0; i < roles.length; i++) {
                if (roles[i].name === 'user') {
                    next()
                    return
                }
            }

            res.status(403).send({
                message: 'Require User Role!',
            })
            return
        })
    })
}

const isGroupAdmin = (req, res, next) => {
    User.findByPk(req.userId).then((user) => {
        user.getRoles().then((roles) => {
            for (let i = 0; i < roles.length; i++) {
                if (roles[i].name === 'group admin') {
                    next()
                    return
                }
            }

            res.status(403).send({
                message: 'Require Group Admin Role!',
            })
            return
        })
    })
}

const isOrganizationAdmin = (req, res, next) => {
    User.findByPk(req.userId).then((user) => {
        user.getRoles().then((roles) => {
            for (let i = 0; i < roles.length; i++) {
                if (roles[i].name === 'group admin') {
                    next()
                    return
                }
            }

            res.status(403).send({
                message: 'Require Organization Admin Role!',
            })
            return
        })
    })
}

const isSuperAdmin = (req, res, next) => {
    User.findByPk(req.userId).then((user) => {
        user.getRoles().then((roles) => {
            for (let i = 0; i < roles.length; i++) {
                if (roles[i].name === 'super admin') {
                    next()
                    return
                }
            }

            res.status(403).send({
                message: 'Require Super Admin Role!',
            })
            return
        })
    })
}

const authJwt = {
    verifyToken: verifyToken,
    isUser: isUser,
    isGroupAdmin: isGroupAdmin,
    isOrganizationAdmin: isOrganizationAdmin,
    isSuperAdmin: isSuperAdmin,
}
module.exports = authJwt
