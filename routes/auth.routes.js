const { verifySignUp } = require('../middleware')
const controller = require('../controllers/auth.controller')

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            'Access-Control-Allow-Headers',
            'x-access-token, Origin, Content-Type, Accept'
        )
        next()
    })

    app.post(
        '/api/auth/signup',
        [
            verifySignUp.checkDuplicateUsernameOrEmail,
            verifySignUp.checkRolesExisted,
            verifySignUp.checkCompanyExisted,
        ],
        controller.signup
    )

    app.post('/api/auth/signin', controller.signin)

    app.post('/api/auth/refreshtoken', controller.refreshToken)

    app.post('/api/auth/signout', controller.signOut)

    app.post('/api/auth/fogotPassword', controller.fogotPassword)

    app.post('/auth/updatePassword/:token', controller.updatePassword)
}
