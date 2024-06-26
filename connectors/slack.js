const { ExpressReceiver, App, LogLevel } = require('@slack/bolt')
const { InstallProvider } = require('@slack/oauth')
const { SocketModeClient } = require('@slack/socket-mode')
const { InitializeSlackOauth } = require('../controllers/slack.controller')

// initialize the installProvider
const installer = new InstallProvider({
    installerOptions: {
        stateVerification: false,
    },
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    stateSecret: process.env.STATE_SECRET,
    authVersion: 'v2',
    scopes: [
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
    ],
    userScopes: ['channels:write', 'channels:write.invites'],
    logLevel: LogLevel.DEBUG,
    stateVerification: false,
    installationStore: {
        storeInstallation: async (installation) => {
            console.log('installation: ' + installation)
            console.log(installation)
            if (
                installation.isEnterpriseInstall &&
                installation.enterprise !== undefined
            ) {
                await InitializeSlackOauth(installation)
            }
            if (installation.team !== undefined) {
                await InitializeSlackOauth(installation)
            }
            // throw new Error(
            //     'Failed saving installation data to installationStore'
            // )
        },
        // fetchInstallation: async (installQuery) => {
        //     console.log('installQuery: ' + installQuery)
        //     console.log(installQuery)
        //     //   if (
        //     //     installQuery.isEnterpriseInstall
        //     //     && installQuery.enterpriseId !== undefined
        //     //   ) {
        //     //     return dbQuery.findUser(installQuery.enterpriseId);
        //     //   }
        //     //   if (installQuery.teamId !== undefined) {
        //     //     return dbQuery.findUser(installQuery.teamId);
        //     //   }
        //     //   throw new Error('Failed fetching installation');
        // },
    },
})

const receiver = new ExpressReceiver({
    signingSecret: process.env.SIGNING_SECRET,
})

const slackApp = new App({
    token: process.env.TOKEN,
    signingSecret: process.env.SIGNING_SECRET,
    socketMode: true,
    logLevel: LogLevel.DEBUG,
    appToken: process.env.APP_TOKEN,
})
// const router = receiver.router

const slack = {
    slackApp: slackApp,
    // router: router,
    installer: installer,
}
module.exports = slack
