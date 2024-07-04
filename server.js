// server/index.js

const express = require('express')
const cors = require('cors')
const cron = require('node-cron')
const dotenv = require('dotenv')
dotenv.config()

const { slackApp, installer } = require('./connectors/slack')
const { runSurvey } = require('./controllers/slack.controller')

const app = express()

const PORT = 3001

const corsOptions = {
    origin: process.env.URL_LOCAL,
    credentials: true, //access-control-allow-credentials:true
    optionSuccessStatus: 200,
}

const scopes = [
    'channels:history',
    'channels:manage',
    'channels:read',
    'channels:write.invites',
    'chat:write',
    'commands',
    'conversations.connect:manage',
    'conversations.connect:read',
    'conversations.connect:write',
    'groups:history',
    'groups:read',
    'groups:write',
    'groups:write.invites',
    'im:history',
    'im:write',
    'mpim:write',
    'mpim:write.invites',
    'users:read',
    'users:read.email',
]
const userScopes = ['channels:write', 'channels:write.invites']

app.use(cors(corsOptions))

// parse requests of content-type - application/json
app.use(express.json())

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }))

// database
const db = require('./models')
// const Role = db.role

db.sequelize.sync()
// force: true will drop the table if it already exists
// db.sequelize.sync({ force: true }).then(() => {
//     console.log('Drop and Resync Database with { force: true }')
//     //initial()
// })

// simple route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to ItsMyDaily application.' })
})

app.get('/slack/install', async (req, res, next) => {
    await installer.handleInstallPath(
        req,
        res,
        {},
        {
            scopes,
            userScopes,
            //metadata: 'some_metadata',
        }
    )
})

const callbackOptions = {
    success: (installation, installOptions, req, res) => {
        const htmlResponse = `<html>
            <link href="//maxcdn.bootstrapcdn.com/bootstrap/3.3.0/css/bootstrap.min.css" rel="stylesheet" id="bootstrap-css">
            <script src="//maxcdn.bootstrapcdn.com/bootstrap/3.3.0/js/bootstrap.min.js"></script>
            <script src="//code.jquery.com/jquery-1.11.1.min.js"></script>
            <!------ Include the above in your HEAD tag ---------->

            <div class="container">
                <div class="row text-center">
                    <div class="col-sm-6 col-sm-offset-3">
                    <br><br> <h2 style="color:#0fad00">Success !</h2>
                    <p style="font-size:20px;color:#5C5C5C;">You have successfully authenticated with Mydaily MVP app.  </p>
                    <a href="${process.env.URL_LOCAL}/settings" class="btn btn-success">     Go Back    </a>
                <br><br>
                    </div>
                    
                </div>
            </div>
        </html>`
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
        res.end(htmlResponse)
    },
    failure: (error, installOptions, req, res) => {
        const htmlResponse = `<html>
            <link href="//maxcdn.bootstrapcdn.com/bootstrap/3.3.0/css/bootstrap.min.css" rel="stylesheet" id="bootstrap-css">
            <script src="//maxcdn.bootstrapcdn.com/bootstrap/3.3.0/js/bootstrap.min.js"></script>
            <script src="//code.jquery.com/jquery-1.11.1.min.js"></script>
            <!------ Include the above in your HEAD tag ---------->

            <div class="container">
                <div class="row text-center">
                    <div class="col-sm-6 col-sm-offset-3">
                    <br><br> <h2 style="color:#eb4934">Oops... Failed!</h2>
                    <p style="font-size:20px;color:#5C5C5C;">Something Went Wrong! Please Try Again or Contact the App Owner.</p>
                    <a href="${process.env.URL_LOCAL}/settings" class="btn btn-danger">     Go Back    </a>
                <br><br>
                    </div>
                    
                </div>
            </div>
        </html>`
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
        res.end(htmlResponse)
    },
}

app.get('/slack/oauth_redirect', async (req, res) => {
    await installer.handleCallback(req, res, callbackOptions)
})

// Middleware
const loggingMiddleware = require('./middleware/logging')
slackApp.use(loggingMiddleware)

// Action Handlers
const registerActionHandlers = require('./handlers/slack/action')
registerActionHandlers(slackApp)

// View Handlers
const registerViewHandlers = require('./handlers/slack/views')
registerViewHandlers(slackApp)

// routes
require('./routes/auth.routes')(app)
require('./routes/user.routes')(app)
require('./routes/google.routes')(app)

app.get('/api/users', (req, res) => {
    runSurvey()
    return res.json('user')
})
;(async () => {
    // Start your app
    await slackApp.start()

    console.log('⚡️ Bolt app is running!')
})()

// Schedule the cron job to run at a specific time
cron.schedule('0 24 18 * * *', () => {
    // Runs at 10:00 AM every day
    console.log('Cron job running...')

    // Call the controller method directly
    runSurvey()
})

// eslint-disable-next-line no-console
app.listen(PORT, () => console.log(`Listening on port ${PORT}`))
