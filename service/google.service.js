const { google } = require('googleapis')

class GoogleService {
    async getMessageList(oauth2Client, maxResults, labelIds, query) {
        try {
            const gmail = google.gmail({ version: 'v1', auth: oauth2Client })

            const response = await gmail?.users?.messages?.list({
                userId: 'me',
                maxResults: maxResults,
                labelIds: labelIds,
                q: query,
            })
            return response
        } catch (error) {
            return error
        }
    }
    async getMessage(oauth2Client, id) {
        try {
            const gmail = google.gmail({ version: 'v1', auth: oauth2Client })

            const response = await gmail?.users?.messages?.get({
                userId: 'me',
                id: id,
            })
            return response
        } catch (error) {
            return error
        }
    }

    async getCalendorEvent(oauth2Client, timeMin, timeMax) {
        try {
            const calendar = google.calendar({
                version: 'v3',
                auth: process.env.GOOGLE_AUTH,
            })
            const response = await calendar?.events?.list({
                auth: oauth2Client,
                calendarId: 'primary',
                singleEvents: true,
                orderBy: 'startTime',
                timeMin: timeMin,
                timeMax: timeMax,
            })
            return response
        } catch (error) {
            return error
        }
    }
    async getThreadsList(oauth2Client, maxResults, labelIds, query) {
        try {
            const gmail = google.gmail({ version: 'v1', auth: oauth2Client })

            const response = await gmail?.users?.threads?.list({
                userId: 'me',
                maxResults: maxResults,
                labelIds: labelIds,
                q: query,
            })
            return response
        } catch (error) {
            return error
        }
    }
    async getThread(oauth2Client, id) {
        try {
            const gmail = google.gmail({ version: 'v1', auth: oauth2Client })

            const response = await gmail?.users?.threads?.get({
                userId: 'me',
                id: id,
            })
            return response
        } catch (error) {
            return error
        }
    }
}

module.exports = GoogleService
