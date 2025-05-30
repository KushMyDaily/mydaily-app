const { authJwt, googleJwt } = require('../middleware')
const workload = require('../controllers/workload.controller')
const stat = require('../controllers/stat.controller')

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            'Access-Control-Allow-Headers',
            'x-access-token, Origin, Content-Type, Accept'
        )
        next()
    })

    app.post('/api/stat/stressfactors/graph', stat.getStressfactors)
    app.post('/api/stat/wellbeing/graph', stat.getWellBeingRelatedData)
    app.post('/api/stat/month/graph', stat.getMonthByFormData)
    app.post('/api/stat/calender/graph', stat.getcalenderData)
    // app.post('/api/stat/details/graph', stat.storeDailyStaticsData)
    // app.post('/api/stat/calendar/graph', stat.storeDailyStaticsData)
    app.post('/api/stat/storedailystatics/graph', stat.storeDailyStaticsData)
    app.post(
        '/api/stat/getwellbeingfactorovertime/graph',
        stat.getWellBeingFactorOvertime
    )
    //manager view
    app.post('/api/stat/manager/teamforms/graph', stat.getTeamFormData)
    app.post(
        '/api/stat/manager/subordinatesforms/graph',
        stat.getSubordinatesFormData
    )
    app.post(
        '/api/stat/manager/getwellbeingfactorovertime/graph',
        stat.getTeamWellbeingFactorOvertime
    )
    //compnay view
    app.post(
        '/api/stat/company/companyforms/graph',
        stat.getCompanyWellBeingRelatedData
    )
    //test api
    app.post('/api/stat/test/wellbeingscore', stat.testStatWellBeingScore)
}
