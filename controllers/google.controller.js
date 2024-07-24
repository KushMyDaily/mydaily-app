const { google } = require('googleapis')
const db = require('../models')
const { googleAuth: GoogleAuth } = db

const oAuth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    `${process.env.URL_LOCAL}/redirect`
)

const calendar = google.calendar({
    version: 'v3',
    auth: process.env.GOOGLE_AUTH,
})

const scopes = [
    'https://www.googleapis.com/auth/calendar',
    'https://mail.google.com/',
    'https://www.googleapis.com/auth/gmail.compose',
]

/**
 * Reads previously authorized credentials from the save file.
 *
 * @return {Promise<OAuth2Client|null>}
 */
async function loadSavedCredentialsIfExist(userId) {
    try {
        let googleAuth = await GoogleAuth.findOne({
            where: { userId: userId },
        })
        if (!googleAuth) {
            return null
        }
        return googleAuth
    } catch (err) {
        return null
    }
}

async function saveCredentials(token, user) {
    const userId = Number(user)
    try {
        const googleAuthToken = await GoogleAuth.create({
            accessToken: token.access_token,
            refreshToken: token.refresh_token,
            expiryDate: token.expiry_date,
            userId: userId,
        })
        return googleAuthToken
    } catch (error) {
        return error
    }
}

exports.updateCredentials = async (token, user) => {
    const userId = Number(user)
    try {
        const googleAuthToken = await GoogleAuth.update(
            {
                accessToken: token.access_token,
                refreshToken: token.refresh_token,
                expiryDate: token.expiry_date,
            },
            {
                where: {
                    userId: userId,
                },
            }
        )
        return googleAuthToken
    } catch (error) {
        return error
    }
}

/**
 * Load or request or authorization to call APIs.
 *
 */
exports.generateAuthorizationUrl = async (req, res) => {
    const userId = req.body.userId
    console.log(userId)

    const authorizationUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes,
        prompt: 'consent',
    })

    let user = await loadSavedCredentialsIfExist(userId)
    if (user) {
        res.status(401).send({ message: 'User already exist' })
    } else {
        res.status(200).send(authorizationUrl)
    }
}

exports.redirect = async (req, res) => {
    const code = await req.query.code
    const user = await req.query.user
    google.options({ auth: oAuth2Client })

    try {
        oAuth2Client.getToken(code, async (err, tokens) => {
            if (err) {
                return res.status(500).send({ message: err.message })
            }

            const oAuthToken = await saveCredentials(tokens, user)
            if (oAuthToken) {
                return res
                    .status(200)
                    .send({ message: 'Token saved sucessfully' })
            }
        })
    } catch (error) {
        return res.status(500).send({ message: error })
    }
}

exports.getCalendarEvent = async (req, res, next) => {
    try {
        const { refreshToken } = req.body

        oAuth2Client.setCredentials({
            refresh_token: refreshToken,
        })

        const response = await calendar.events.list({
            auth: oAuth2Client,
            calendarId: 'primary',
            timeMin: new Date().toISOString(),
            maxResults: 10,
            singleEvents: true,
            orderBy: 'startTime',
        })
        const events = response.data.items
        if (!events || events.length === 0) {
            console.log('No upcoming events found.')
            return
        }

        res.send({ data: events })
    } catch (error) {
        res.send({ error: error.message })
    }
}

exports.getMessageList = async (req, res, next) => {
    try {
        const { userId, maxResults, labelIds } = req.body

        const gmail = google.gmail({ version: 'v1', auth: req.oauth2Client })

        const res = await gmail.users.messages.list({
            userId: userId,
            maxResults: maxResults,
            labelIds: labelIds,
        })
        res.send({ data: res.data })
    } catch (error) {
        res.send({ error: error.message })
    }
}
