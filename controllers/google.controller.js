const { google } = require('googleapis')
const moment = require('moment')
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
                const events = response?.data?.items

                // Filter out events that fall on Saturday (6) or Sunday (0)
                const filteredEvents = events.filter((event) => {
                    const eventDate = event.start.dateTime || event.start.date // dateTime for timed events, date for all-day events
                    //const dayOfWeek = new Date(eventDate).getDay()
                    const m = moment(eventDate)
                    const dayOfWeek = m.day()

                    // Keep only events that don't fall on Saturday (6) or Sunday (0)
                    return dayOfWeek !== 0 && dayOfWeek !== 6
                })
                return filteredEvents
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

                // Extract the `internalDate` and filter out messages sent on Saturday (6) or Sunday (0)
                const filteredMessages = dailyMessages.filter((res) => {
                    const internalDate = res.internalDate
                    const messageDate = moment(parseInt(internalDate)) // Create a moment object with the timestamp
                    const dayOfWeek = messageDate.day() // Get the day of the week using moment.js

                    // Keep only messages that are not sent on Saturday (6) or Sunday (0)
                    return dayOfWeek !== 0 && dayOfWeek !== 6
                })

                return filteredMessages
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
                // return response?.data
                const threads = response?.data.threads

                // Fetch full thread details to get the latest message's internalDate
                const fetchThreadDetails = threads.map((thread) => {
                    return googleService.getThread(oauth2Client, thread.id)
                })
                const a = await Promise.all(fetchThreadDetails)
                    .then((responses) => {
                        // Extract the latest message's `internalDate` and filter out threads with messages sent on Saturday or Sunday
                        const filteredThreads = responses.filter((res) => {
                            const messages = res.data.messages
                            const latestMessage = messages[messages.length - 1] // Get the latest message in the thread
                            const internalDate = latestMessage.internalDate // Timestamp in milliseconds
                            const messageDate = new Date(parseInt(internalDate))
                            const dayOfWeek = messageDate.getDay()

                            // Keep only threads where the latest message was not sent on Saturday (6) or Sunday (0)
                            return dayOfWeek !== 0 && dayOfWeek !== 6
                        })

                        return filteredThreads && filteredThreads?.length > 0
                            ? filteredThreads?.length
                            : 0
                    })
                    .catch((error) =>
                        console.error('Error fetching thread details:', error)
                    )
                return a
            }
        }
    } catch (error) {
        console.log('getEmailThreads error', error)
        return []
    }
}
