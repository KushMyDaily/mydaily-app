// config/googleAuth.js
const { google } = require('googleapis')
const { OAuth2 } = google.auth

function createOAuth2Client() {
    return new OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        `${process.env.URL_LOCAL}/redirect`
    )
}

async function refreshAccessToken(oauth2Client) {
    try {
        const { credentials } = await oauth2Client.refreshAccessToken()
        oauth2Client.setCredentials(credentials)
        console.log('Access token refreshed:', credentials)
        return credentials
    } catch (error) {
        console.error('Error refreshing access token:', error)
        throw error
    }
}

module.exports = { createOAuth2Client, refreshAccessToken }
