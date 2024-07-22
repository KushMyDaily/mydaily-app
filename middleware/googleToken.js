// middleware/tokenMiddleware.js
const {
    createOAuth2Client,
    refreshAccessToken,
} = require('../config/googleAuth.config')
const { updateCredentials } = require('../controllers/google.controller')
const db = require('../models')
const { googleAuth: GoogleAuth } = db

async function checkAndRefreshToken(req, res, next) {
    const userId = req.query.userId // Assume userId is passed as a query parameter

    if (!userId) {
        return res.status(400).send('User ID is required')
    }

    // const user = getUser(userId);
    let googleAuthUser = await GoogleAuth.findOne({
        where: { userId: userId },
    })

    if (!googleAuthUser) {
        return res.status(404).send('User not found')
    }

    const oauth2Client = createOAuth2Client()
    oauth2Client.setCredentials({
        refresh_token: googleAuthUser.refreshToken,
        access_token: googleAuthUser.accessToken,
        expiry_date: googleAuthUser.expiryDate,
    })

    const now = new Date()
    const isTokenExpired =
        oauth2Client.credentials.expiry_date &&
        oauth2Client.credentials.expiry_date <= now.getTime()

    if (isTokenExpired) {
        try {
            const newCredentials = await refreshAccessToken(oauth2Client)
            if (newCredentials && userId) {
                await updateCredentials(newCredentials, userId)
            }
        } catch (error) {
            return res.status(500).send('Error refreshing access token')
        }
    }

    req.oauth2Client = oauth2Client
    next()
}

const googleJwt = {
    checkAndRefreshToken: checkAndRefreshToken,
}

module.exports = googleJwt
