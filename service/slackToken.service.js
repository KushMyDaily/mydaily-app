const { WebClient } = require('@slack/web-api')
const db = require('../models')
const SlackOAuthAccess = db.slackOAuthAccess

class TokenService {
    constructor() {
        // Configuration
        // this.clientId = process.env.SLACK_CLIENT_ID;
        // this.clientSecret = process.env.SLACK_CLIENT_SECRET;
        // this.slackApiUrl = 'https://slack.com/api';

        // Buffer time (in milliseconds) before token expiration to refresh
        this.refreshBuffer = 5 * 60 * 1000 // 5 minutes
    }

    /**
     * Get a valid access token for a workspace
     * Will refresh if needed
     */
    async getValidToken(teamId) {
        if (!teamId) {
            throw new Error('Team ID is required')
        }
        const tokenRecord = await SlackOAuthAccess.findOne({
            where: {
                teamId: teamId,
            },
        })

        if (!tokenRecord) {
            throw new Error(`No active token found for team ${teamId}`)
        }

        // Check if token needs refreshing
        const now = new Date()
        const bufferTime = new Date(
            new Date(tokenRecord.botExpiresAt).getTime() - this.refreshBuffer
        )

        if (now >= bufferTime) {
            try {
                return await this.refreshAccessToken(tokenRecord)
            } catch (error) {
                if (
                    error.message.includes('token_revoked') ||
                    error.message.includes('invalid_auth') ||
                    error.message.includes('invalid_refresh_token')
                ) {
                    await this.markTokenRevoked(tokenRecord.teamId)
                    throw new Error(
                        `Authentication for team ${teamId} has been revoked`
                    )
                }
                throw error
            }
        }

        return tokenRecord.botToken
    }

    /**
     * Refresh an access token
     */
    async refreshAccessToken(tokenRecord) {
        try {
            const client = new WebClient()
            const response = await client.oauth.v2
                .access({
                    client_id: process.env.CLIENT_ID,
                    client_secret: process.env.CLIENT_SECRET,
                    grant_type: 'refresh_token',
                    refresh_token: tokenRecord.botRefreshToken,
                })
                .catch((e) => e)

            if (!response.ok) {
                throw new Error(`Slack API error: ${response.data.error}`)
            }

            // Calculate expiration time (usually not provided directly by Slack)
            const currentUTCSec = Math.floor(Date.now() / 1000)
            const accessTokenExpiresAt = currentUTCSec + response.expires_in

            if (response.token_type === 'bot') {
                await SlackOAuthAccess.update(
                    {
                        botToken: response.access_token,
                        botRefreshToken: response.refresh_token,
                        botExpiresAt: accessTokenExpiresAt,
                    },
                    {
                        where: {
                            teamId: response.team.id,
                        },
                    }
                )
            }

            if (response.token_type === 'user') {
                await SlackOAuthAccess.update(
                    {
                        userToken: response.access_token,
                        userRefreshToken: response.refresh_token,
                        userExpiresAt: accessTokenExpiresAt,
                    },
                    {
                        where: {
                            teamId: response.team.id,
                        },
                    }
                )
            }

            return response.access_token
        } catch (error) {
            console.error('Error refreshing access token:', error.message)
            throw error
        }
    }

    /**
     * Store a new token set in the database   /////////////////////   This part handle on slack.controller.js
     */
    //   async storeTokens(authResponse, workspaceId, userId) {
    //     const now = new Date();
    //     const accessTokenExpiresAt = new Date(now.getTime() + (authResponse.expires_in * 1000));
    //     const refreshTokenExpiresAt = new Date(now.getTime() + (90 * 24 * 60 * 60 * 1000)); // 90 days

    //     // Check if token already exists for this workspace
    //     const existingToken = await TokenModel.findOne({ workspaceId });

    //     if (existingToken) {
    //       // Update existing record
    //       existingToken.accessToken = authResponse.access_token;
    //       existingToken.refreshToken = authResponse.refresh_token;
    //       existingToken.accessTokenExpiresAt = accessTokenExpiresAt;
    //       existingToken.refreshTokenExpiresAt = refreshTokenExpiresAt;
    //       existingToken.scope = authResponse.scope;
    //       existingToken.isActive = true;
    //       existingToken.lastRefreshedAt = now;
    //       await existingToken.save();
    //       return existingToken;
    //     } else {
    //       // Create new record
    //       return await TokenModel.create({
    //         workspaceId,
    //         userId,
    //         accessToken: authResponse.access_token,
    //         refreshToken: authResponse.refresh_token,
    //         accessTokenExpiresAt,
    //         refreshTokenExpiresAt,
    //         scope: authResponse.scope,
    //         isActive: true,
    //         lastRefreshedAt: now
    //       });
    //     }
    //   }

    /**
     * Mark a token as revoked/inactive
     */
    async markTokenRevoked(teamId) {
        await SlackOAuthAccess.update(
            { needsReauthorization: true },
            { where: { teamId: teamId } }
        )
        console.log(`team ${teamId} marked as revoked/inactive`)
    }

    /**
     * Check for tokens nearing expiry and refresh them
     * Run this as a scheduled job
     */
    async checkAndRefreshExpiringTokens() {
        const now = new Date()
        const expiryThreshold = Math.floor(
            (now.getTime() + this.refreshBuffer) / 1000
        )

        const tokensToRefresh = await SlackOAuthAccess.findAll({
            where: {
                botExpiresAt: {
                    [db.Sequelize.Op.lt]: expiryThreshold,
                },
                needsReauthorization: false,
            },
        })

        console.log(`Found ${tokensToRefresh.length} tokens to refresh`)

        for (const token of tokensToRefresh) {
            try {
                await this.refreshAccessToken(token)
                console.log(
                    `Successfully refreshed token for team ${token.teamId}`
                )
            } catch (error) {
                console.error(
                    `Failed to refresh token for team ${token.teamId}:`,
                    error.message
                )
                if (
                    error.message.includes('token_revoked') ||
                    error.message.includes('invalid_auth') ||
                    error.message.includes('invalid_refresh_token')
                ) {
                    await this.markTokenRevoked(token.teamId)
                }
            }
        }
    }
}

module.exports = new TokenService()
