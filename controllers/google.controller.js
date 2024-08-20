const { google } = require('googleapis')
const db = require('../models')
const { checkAndRefreshToken } = require('../middleware/googleToken')
const GoogleService = require('../service/google.service')
const { googleAuth: GoogleAuth } = db

const googleService = new GoogleService()

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
    'https://www.googleapis.com/auth/gmail.modify',
    'https://www.googleapis.com/auth/gmail.readonly',
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

exports.getDailyMessageCount = async (userId, labelIds, query) => {
    try {
        const oauth2Client = await checkAndRefreshToken(userId)
        if (oauth2Client) {
            const maxResults = 500
            const response = await googleService.getMessageList(
                oauth2Client,
                maxResults,
                labelIds,
                query
            )
            if (response?.data) {
                return response?.data
            }
        }
    } catch (error) {
        console.log('getDailyMessageCount error', error)
    }
}

exports.getDailyCalendarEvent = async (userId, timeMin, timeMax) => {
    try {
        const oauth2Client = await checkAndRefreshToken(userId)
        if (oauth2Client) {
            const response = await googleService.getCalendorEvent(
                oauth2Client,
                timeMin,
                timeMax
            )
            if (response?.data) {
                return response?.data?.items
            }
            console.log('message response', response)
        }
    } catch (error) {
        console.log('getDailyCalendarEvent error', error)
    }
}

exports.getDailyMessageDetails = async (userId, labelIds, query) => {
    try {
        const oauth2Client = await checkAndRefreshToken(userId)
        if (oauth2Client) {
            const maxResults = 500
            const response = await googleService.getMessageList(
                oauth2Client,
                maxResults,
                labelIds,
                query
            )
            if (response?.data.messages && response?.data.messages.length > 0) {
                const messages = response.data.messages
                // return response?.data

                // Use Promise.all to handle async operations
                const dailyMessages = await Promise.all(
                    messages.map(async (message) => {
                        const messageResponse = await googleService.getMessage(
                            oauth2Client,
                            message.id
                        )
                        return messageResponse.data
                    })
                )

                return dailyMessages
            }
        }
    } catch (error) {
        console.log('getDailyMessageCount error', error)
        return []
    }
}

exports.getEmailThreads = async (userId, labelIds, query) => {
    try {
        const oauth2Client = await checkAndRefreshToken(userId)
        if (oauth2Client) {
            const maxResults = 500
            const response = await googleService.getThreadsList(
                oauth2Client,
                maxResults,
                labelIds,
                query
            )
            if (response?.data) {
                return response?.data
            }
        }
    } catch (error) {
        console.log('getEmailThreads error', error)
        return []
    }
}
