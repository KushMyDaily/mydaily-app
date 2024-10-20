// middleware/tokenMiddleware.js
const {
    createOAuth2Client,
    refreshAccessToken,
} = require('../config/googleAuth.config')
const GoogleController = require('../controllers/google.controller')
const db = require('../models')
const { googleAuth: GoogleAuth } = db

async function checkAndRefreshToken(userId) {
    if (!userId) {
        console.log('User ID is required')
        return null
    }

    // const user = getUser(userId);
    let googleAuthUser = await GoogleAuth.findOne({
        where: { userId: userId },
    })

    if (!googleAuthUser) {
        console.log('Google auth user not found')
        return null
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
                await GoogleController.updateCredentials(newCredentials, userId)
                return oauth2Client
            }
        } catch (error) {
            console.log('Error refreshing access token', error)
            return null
        }
    }

    return oauth2Client
}

module.exports = {
    checkAndRefreshToken,
}
