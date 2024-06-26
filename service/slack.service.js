const { WebClient } = require('@slack/web-api')
const db = require('../models')
const SlackOAuthAccess = db.slackOAuthAccess

class SlackService {
    async authorize(teamId) {
        try {
            let queryResult
            if (teamId) {
                queryResult = await SlackOAuthAccess.findOne({
                    where: {
                        teamId: teamId,
                    },
                })
            }

            if (queryResult === undefined) {
                throw new Error(
                    'Failed fetching data from the Installation Store'
                )
            }

            const authResult = {}
            authResult.userToken = queryResult.userToken

            if (queryResult.team !== undefined) {
                authResult.teamId = queryResult.teamId
            } else if (teamId !== undefined) {
                /**
                 *  since queryResult is a org installation, it won't have team.id. If one was passed in via source,
                 *  we should add it to the authResult
                 */
                authResult.teamId = teamId
            }

            if (queryResult.enterprise !== undefined) {
                authResult.enterprise = queryResult.enterprise
            }

            if (queryResult.botId !== undefined) {
                authResult.botToken = queryResult.botToken
                authResult.botId = queryResult.botId

                // Token Rotation Enabled (Bot Token)
                if (queryResult.botRefreshToken !== undefined) {
                    authResult.botRefreshToken = queryResult.botRefreshToken
                    authResult.botExpiresAt = queryResult.botExpiresAt // utc, seconds
                }
            }

            // Token Rotation Enabled (User Token)
            if (queryResult.userRefreshToken !== undefined) {
                authResult.userRefreshToken = queryResult.userRefreshToken
                authResult.userExpiresAt = queryResult.userExpiresAt // utc, seconds
            }

            /*
             * Token Rotation (Expiry Check + Refresh)
             * The presence of `(bot|user)TokenExpiresAt` indicates having opted into token rotation.
             * If the token has expired, or will expire within 2 hours, the token is refreshed and
             * the `authResult` and `Installation` are updated with the new values.
             */
            if (
                authResult.botRefreshToken !== undefined ||
                authResult.userRefreshToken !== undefined
            ) {
                const currentUTCSec = Math.floor(Date.now() / 1000) // seconds
                const tokensToRefresh = detectExpiredOrExpiringTokens(
                    authResult,
                    currentUTCSec
                )

                if (tokensToRefresh.length > 0) {
                    const refreshResponses =
                        await this.refreshExpiringTokens(tokensToRefresh)

                    // TODO: perhaps this for..of loop could introduce an async delay due to await'ing once for each refreshResp?
                    // Could we rewrite to be more performant and not trigger the eslint warning? Perhaps a concurrent async
                    // map/reduce? But will the return value be the same? Does order of this array matter?
                    // eslint-disable-next-line no-restricted-syntax
                    for (const refreshResp of refreshResponses) {
                        const tokenType = refreshResp.token_type

                        // Update Authorization
                        if (tokenType === 'bot') {
                            authResult.botToken = refreshResp.access_token
                            authResult.botRefreshToken =
                                refreshResp.refresh_token
                            authResult.botExpiresAt =
                                currentUTCSec + refreshResp.expires_in

                            await SlackOAuthAccess.update(
                                {
                                    botToken: refreshResp.access_token,
                                    botRefreshToken: refreshResp.refresh_token,
                                    botExpiresAt:
                                        currentUTCSec + refreshResp.expires_in,
                                },
                                {
                                    where: {
                                        teamId: teamId,
                                    },
                                }
                            )
                        }

                        if (tokenType === 'user') {
                            authResult.userToken = refreshResp.access_token
                            authResult.userRefreshToken =
                                refreshResp.refresh_token
                            authResult.userExpiresAt =
                                currentUTCSec + refreshResp.expires_in

                            await SlackOAuthAccess.update(
                                {
                                    userToken: refreshResp.access_token,
                                    userRefreshToken: refreshResp.refresh_token,
                                    userExpiresAt:
                                        currentUTCSec + refreshResp.expires_in,
                                },
                                {
                                    where: {
                                        teamId: teamId,
                                    },
                                }
                            )
                        }
                    }
                }
            }

            return authResult
        } catch (error) {
            console.log('Auth error', error)
            //throw new AuthorizationError(error.message);
        }
    }

    /**
     * refreshExpiringTokens refreshes expired access tokens using the `oauth.v2.access` endpoint.
     *
     * The return value is an Array of Promises made up of the resolution of each token refresh attempt.
     */
    async refreshExpiringTokens(tokensToRefresh) {
        const client = new WebClient()

        const refreshPromises = tokensToRefresh.map(
            async (refreshToken) =>
                await client.oauth.v2
                    .access({
                        client_id: process.env.CLIENT_ID,
                        client_secret: process.env.CLIENT_SECRET,
                        grant_type: 'refresh_token',
                        refresh_token: refreshToken,
                    })
                    .catch((e) => e)
        )

        return Promise.all(refreshPromises)
    }

    async listUsers(token, teamId) {
        const webClient = new WebClient(token)

        if (webClient) {
            // Call the users.list method using the WebClient
            const result = await webClient.users.list({ team_id: teamId })
            return result
        }
    }
}

/**
 * detectExpiredOrExpiringTokens determines access tokens' eligibility for refresh.
 *
 * The return value is an Array of expired or soon-to-expire access tokens.
 */
function detectExpiredOrExpiringTokens(authResult, currentUTCSec) {
    const tokensToRefresh = []
    const EXPIRY_WINDOW = 7200 // 2 hours

    if (
        authResult.botRefreshToken !== undefined &&
        authResult.botExpiresAt !== undefined
    ) {
        const botExpiresIn = authResult.botExpiresAt - currentUTCSec
        if (botExpiresIn <= EXPIRY_WINDOW) {
            tokensToRefresh.push(authResult.botRefreshToken)
        }
    }

    if (
        authResult.userRefreshToken !== undefined &&
        authResult.userExpiresAt !== undefined
    ) {
        const userExpiresIn = authResult.userExpiresAt - currentUTCSec
        if (userExpiresIn <= EXPIRY_WINDOW) {
            tokensToRefresh.push(authResult.userRefreshToken)
        }
    }

    return tokensToRefresh
}

module.exports = SlackService
