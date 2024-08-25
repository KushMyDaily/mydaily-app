const { authJwt, googleJwt } = require('../middleware')
const controller = require('../controllers/google.controller')
const controller2 = require('../controllers/workload.controller')
const controller3 = require('../controllers/relationships.controller')
const controller4 = require('../controllers/timeBoundaries.controller')
const controller5 = require('../controllers/autonomy.controller')
const controller6 = require('../controllers/communications.controller')

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            'Access-Control-Allow-Headers',
            'x-access-token, Origin, Content-Type, Accept'
        )
        next()
    })

    app.post(
        '/api/google/auth',
        // [authJwt.verifyToken],
        controller.generateAuthorizationUrl
    )
    app.get(
        '/api/redirect',
        // [authJwt.verifyToken],
        controller.redirect
    )

    // app.post(
    //     '/api/google/calendarevent',
    //     [authJwt.verifyToken],
    //     controller.getCalendarEvent
    // )

    app.get('/api/google/workload', controller2.storeDailyWorkloadStats)
    app.get('/api/google/relation', controller3.storeReleationshipsStats)
    app.get('/api/google/timeBoundaries', controller4.storetimeBoundariesStats)
    app.get('/api/google/autonomy', controller5.storeAutonomyStats)
    app.get('/api/google/communication', controller6.storeCommunicationStats)

    // app.post(
    //     '/api/google/calendarevent',
    //     [googleJwt.checkAndRefreshToken],
    //     controller.getCalendarEvent
    // )
}
