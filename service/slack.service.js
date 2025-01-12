const { WebClient } = require('@slack/web-api')
const db = require('../models')
const SlackOAuthAccess = db.slackOAuthAccess

class SlackService {
    async authorize(teamId) {
        try {
            let queryResult
            if (teamId) {
                queryResult = await SlackOAuthAccess.findOne({
                    where: { teamId: teamId },
                })
            }

            if (!queryResult) {
                throw new Error(
                    'Failed fetching data from the Installation Store'
                )
            }

            const authResult = {
                userToken: queryResult.userToken,
                teamId: queryResult.team || teamId,
                enterprise: queryResult.enterprise,
                botToken: queryResult.botToken,
                botId: queryResult.botId,
                botRefreshToken: queryResult.botRefreshToken,
                botExpiresAt: queryResult.botExpiresAt,
                userRefreshToken: queryResult.userRefreshToken,
                userExpiresAt: queryResult.userExpiresAt,
            }

            const currentUTCSec = Math.floor(Date.now() / 1000)
            const tokensToRefresh = this.detectExpiredOrExpiringTokens(
                authResult,
                currentUTCSec
            )

            if (tokensToRefresh.length > 0) {
                await this.refreshAndStoreTokens(
                    authResult,
                    tokensToRefresh,
                    currentUTCSec,
                    teamId
                )
            }

            return authResult
        } catch (error) {
            console.error('Auth error:', error)
            throw error
        }
    }

    async safeApiCall(apiCallFn, tokenType, authResult, teamId) {
        try {
            return await apiCallFn()
        } catch (error) {
            if (error.data?.error === 'token_expired') {
                console.log('Token expired, attempting to refresh...')
                const tokensToRefresh =
                    tokenType === 'bot' && authResult.botRefreshToken
                        ? [authResult.botRefreshToken]
                        : tokenType === 'user' && authResult.userRefreshToken
                          ? [authResult.userRefreshToken]
                          : []

                if (tokensToRefresh.length > 0) {
                    const refreshResponses =
                        await this.refreshExpiringTokens(tokensToRefresh)
                    const refreshResp = refreshResponses[0] // Only one token to refresh here

                    if (refreshResp.token_type === tokenType) {
                        // Update the token in memory
                        const newToken = refreshResp.access_token
                        const newRefreshToken = refreshResp.refresh_token
                        const newExpiresAt =
                            Math.floor(Date.now() / 1000) +
                            refreshResp.expires_in

                        // Persist new tokens to DB
                        await SlackOAuthAccess.update(
                            {
                                [`${tokenType}Token`]: newToken,
                                [`${tokenType}RefreshToken`]: newRefreshToken,
                                [`${tokenType}ExpiresAt`]: newExpiresAt,
                            },
                            { where: { teamId } }
                        )

                        // Retry the API call with the new token
                        return await apiCallFn()
                    }
                }
            } else if (error.data?.error === 'invalid_refresh_token') {
                console.log(
                    'Invalid refresh token. App reauthorization required.'
                )
                // Update database to mark the token as invalid
                await SlackOAuthAccess.update(
                    {
                        [`${tokenType}RefreshToken`]: null,
                        [`${tokenType}Token`]: null,
                    },
                    { where: { teamId } }
                )

                // Notify the admin or log for monitoring
                console.log(`Team ${teamId} needs to reauthorize the app.`)
                throw new Error(
                    'App needs reauthorization due to invalid refresh token.'
                )
            }

            // Rethrow if error is not related to token issues
            throw error
        }
    }

    async refreshAndStoreTokens(
        authResult,
        tokensToRefresh,
        currentUTCSec,
        teamId
    ) {
        const refreshResponses =
            await this.refreshExpiringTokens(tokensToRefresh)

        for (const refreshResp of refreshResponses) {
            const tokenType = refreshResp.token_type

            if (tokenType === 'bot') {
                authResult.botToken = refreshResp.access_token
                authResult.botRefreshToken = refreshResp.refresh_token
                authResult.botExpiresAt = currentUTCSec + refreshResp.expires_in

                await SlackOAuthAccess.update(
                    {
                        botToken: refreshResp.access_token,
                        botRefreshToken: refreshResp.refresh_token,
                        botExpiresAt: currentUTCSec + refreshResp.expires_in,
                    },
                    { where: { teamId: teamId } }
                )
            }

            if (tokenType === 'user') {
                authResult.userToken = refreshResp.access_token
                authResult.userRefreshToken = refreshResp.refresh_token
                authResult.userExpiresAt =
                    currentUTCSec + refreshResp.expires_in

                await SlackOAuthAccess.update(
                    {
                        userToken: refreshResp.access_token,
                        userRefreshToken: refreshResp.refresh_token,
                        userExpiresAt: currentUTCSec + refreshResp.expires_in,
                    },
                    { where: { teamId: teamId } }
                )
            }
        }
    }

    async refreshExpiringTokens(tokensToRefresh) {
        const client = new WebClient()

        const refreshPromises = tokensToRefresh.map(async (refreshToken) => {
            try {
                return await client.oauth.v2.access({
                    client_id: process.env.CLIENT_ID,
                    client_secret: process.env.CLIENT_SECRET,
                    grant_type: 'refresh_token',
                    refresh_token: refreshToken,
                })
            } catch (error) {
                console.error('Token refresh failed:', error)
                return null // Return null for failed refresh attempts
            }
        })

        return (await Promise.all(refreshPromises)).filter(
            (response) => response !== null
        )
    }

    async listUsers(token, teamId) {
        const webClient = new WebClient(token)

        if (webClient) {
            const apiCall = async () =>
                webClient.users.list({ team_id: teamId })
            return await this.safeApiCall(
                apiCall,
                'bot',
                { botToken: token },
                teamId
            )
        }
    }

    detectExpiredOrExpiringTokens(authResult, currentUTCSec) {
        const tokensToRefresh = []
        const EXPIRY_WINDOW = 7200 // 2 hours

        if (authResult.botRefreshToken && authResult.botExpiresAt) {
            const botExpiresIn = authResult.botExpiresAt - currentUTCSec
            if (botExpiresIn <= EXPIRY_WINDOW) {
                tokensToRefresh.push(authResult.botRefreshToken)
            }
        }

        if (authResult.userRefreshToken && authResult.userExpiresAt) {
            const userExpiresIn = authResult.userExpiresAt - currentUTCSec
            if (userExpiresIn <= EXPIRY_WINDOW) {
                tokensToRefresh.push(authResult.userRefreshToken)
            }
        }

        return tokensToRefresh
    }
}

module.exports = SlackService
