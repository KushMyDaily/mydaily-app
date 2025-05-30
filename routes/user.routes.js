const { authJwt } = require('../middleware')
const controller = require('../controllers/user.controller')

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            'Access-Control-Allow-Headers',
            'x-access-token, Origin, Content-Type, Accept'
        )
        next()
    })

    app.get('/api/test/all', [authJwt.verifyToken], controller.allAccess)
    app.get(
        '/api/checksocialauth/:userid',
        [authJwt.verifyToken],
        controller.checkSocialAuth
    )
    app.post(
        '/api/updateprofile',
        [authJwt.verifyToken],
        controller.updateProfile
    )
    app.get(
        '/api/getprofile/:userid',
        [authJwt.verifyToken],
        controller.getProfile
    )
    app.post('/api/sendconcern/', [authJwt.verifyToken], controller.sendConcern)
    app.get('/api/monthlyNotification', controller.monthlyNotification)
    app.get('/api/unsubscribeEmail/', controller.unsubscribeEmail)

    // app.get(
    //   "/api/test/user",
    //   [authJwt.verifyToken],
    //   controller.userBoard
    // );

    // app.get(
    //   "/api/test/mod",
    //   [authJwt.verifyToken, authJwt.isModerator],
    //   controller.moderatorBoard
    // );

    // app.get(
    //   "/api/test/admin",
    //   [authJwt.verifyToken, authJwt.isAdmin],
    //   controller.adminBoard
    // );
}
