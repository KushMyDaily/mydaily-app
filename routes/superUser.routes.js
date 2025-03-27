const superUser = require('../controllers/superUser.controller')

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            'Access-Control-Allow-Headers',
            'x-access-token, Origin, Content-Type, Accept'
        )
        next()
    })

    app.post('/api/superuser/surveyresponse', superUser.getSurveyResponseRate)
    app.get('/api/superuser/getcompanylist', superUser.getCompanyList)
    app.get(
        '/api/superuser/getcompanydetails/:companyId',
        superUser.getCompanyDetailsById
    )
}
