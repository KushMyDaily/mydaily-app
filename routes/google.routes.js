const { authJwt } = require('../middleware')
const controller = require('../controllers/google.controller')

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            'Access-Control-Allow-Headers',
            'x-access-token, Origin, Content-Type, Accept'
        )
        next()
    })

    app.post(
        '/api/auth',
        // [authJwt.verifyToken],
        controller.generateAuthorizationUrl
    )
    app.get(
        '/redirect',
        // [authJwt.verifyToken],
        controller.redirect
    )

    app.post(
        '/api/google/calendarevent',
        [authJwt.verifyToken],
        controller.getCalendarEvent
    )
}
