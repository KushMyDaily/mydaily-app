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
app.get('/api', (req, res) => {
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
        res.send('successful!')
    },
    failure: (error, installOptions, req, res) => {
        res.send('failure')
    },
}

app.get('/slack/oauth_redirect', async (req, res) => {
    await installer.handleCallback(req, res, callbackOptions)
})

// slackApp.use(async ({ payload, next }) => {
//     console.log('Incoming request:', payload)
//     await next()
// })

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

app.get('/users', (req, res) => {
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
