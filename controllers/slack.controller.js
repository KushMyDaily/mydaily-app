const db = require('../models')
const { WebClient } = require('@slack/web-api')
const SlackOAuthController = require('./slackOAuth.controller')
const WorkspaceUserController = require('./workspaceUser.controller')
const SlackService = require('../service/slack.service')
const {
    slackOAuthAccess: SlackOAuthAccess,
    workspaceUser: WorkspaceUser,
    user: User,
} = db

const { Op, Sequelize } = db.Sequelize

const slackService = new SlackService()
const webClient = new WebClient()

exports.runSurvey = async () => {
    try {
        const slackOauth = await SlackOAuthController.findAll()

        if (slackOauth) {
            slackOauth.forEach(async (oauth) => {
                let token
                await slackService
                    .authorize(oauth.teamId)
                    .then((res) => {
                        if (oauth.tokenType === 'bot') {
                            token = res.botToken
                        } else if (oauth.tokenType === 'user') {
                            token = res.userToken
                        }
                    })
                    .catch((err) => {
                        throw new Error('Failed authorize token', err)
                    })

                if (oauth) {
                    const filtedWorkspaceUsers = await Promise.all(
                        oauth.workspace_users.map(async (workspaceUser) => {
                            const rows = await User.findAll({
                                where: {
                                    [Op.or]: [
                                        { workspaceUserIds: workspaceUser.id }, // Check for equality with number
                                        {
                                            // Check if the column is not null and not empty
                                            [Op.and]: [
                                                {
                                                    workspaceUserIds: {
                                                        [Op.ne]: null,
                                                    },
                                                }, // Ensure it's not null
                                                {
                                                    workspaceUserIds: {
                                                        [Op.ne]: '',
                                                    },
                                                }, // Ensure it's not empty
                                                Sequelize.where(
                                                    Sequelize.fn(
                                                        'JSON_CONTAINS',
                                                        Sequelize.col(
                                                            'workspaceUserIds'
                                                        ),
                                                        JSON.stringify([
                                                            workspaceUser.id,
                                                        ])
                                                    ),
                                                    true
                                                ),
                                            ],
                                        },
                                    ],
                                },
                            })
                            // Return the workspaceUser if rows.length > 0, otherwise return null
                            return rows.length > 0 ? workspaceUser : null
                        })
                    )

                    for (const user of filtedWorkspaceUsers.filter(
                        (user) => user !== null
                    )) {
                        try {
                            const postMessage = async (token) => {
                                return await webClient.chat.postMessage({
                                    token: token,
                                    channel: user.userId,
                                    text: 'survey',
                                    blocks: [
                                        {
                                            type: 'header',
                                            text: {
                                                type: 'plain_text',
                                                text: 'Hey :wave: !',
                                                emoji: true,
                                            },
                                        },
                                        {
                                            type: 'divider',
                                        },
                                        {
                                            type: 'section',
                                            text: {
                                                type: 'plain_text',
                                                text: "Please take a time to fill today's survey.",
                                                emoji: true,
                                            },
                                        },
                                        {
                                            type: 'actions',
                                            elements: [
                                                {
                                                    type: 'button',
                                                    text: {
                                                        type: 'plain_text',
                                                        text: 'Open survey',
                                                        emoji: true,
                                                    },
                                                    value: 'click_me_123',
                                                    action_id: 'actionId-0',
                                                },
                                            ],
                                        },
                                    ],
                                })
                            }

                            // Attempt to post the message
                            let postedResponse
                            try {
                                postedResponse = await postMessage(token)
                            } catch (error) {
                                // Check for token expiration
                                if (
                                    error.data &&
                                    error.data.error === 'token_expired'
                                ) {
                                    console.log(
                                        'Token expired, refreshing token...'
                                    )

                                    // Refresh the token
                                    const authResult =
                                        await slackService.authorize(
                                            oauth.teamId
                                        )
                                    const refreshedToken =
                                        oauth.tokenType === 'bot'
                                            ? authResult.botToken
                                            : authResult.userToken

                                    // Retry posting the message with the refreshed token
                                    postedResponse =
                                        await postMessage(refreshedToken)

                                    // Update the token in the database if necessary
                                    await SlackOAuthAccess.update(
                                        {
                                            [oauth.tokenType === 'bot'
                                                ? 'botToken'
                                                : 'userToken']: refreshedToken,
                                        },
                                        {
                                            where: { teamId: oauth.teamId },
                                        }
                                    )
                                } else if (
                                    error.data &&
                                    error.data?.error ===
                                        'invalid_refresh_token'
                                ) {
                                    console.log(
                                        'Invalid refresh token. App reauthorization required.'
                                    )
                                    // Update database to mark the token as invalid
                                    await SlackOAuthAccess.update(
                                        {
                                            [`${oauth.tokenType}RefreshToken`]:
                                                null,
                                            [`${oauth.tokenType}Token`]: null,
                                        },
                                        { where: { teamId: oauth.teamId } }
                                    )

                                    // Notify the admin or log for monitoring
                                    console.log(
                                        `Team ${oauth.teamId} needs to reauthorize the app.`
                                    )
                                    throw new Error(
                                        'App needs reauthorization due to invalid refresh token.'
                                    )
                                } else if (
                                    error.data &&
                                    error.data.error === 'invalid_auth'
                                ) {
                                    console.error(
                                        `Invalid auth error for teamId: ${oauth.teamId}`
                                    )

                                    // Mark the team as needing reauthorization
                                    await SlackOAuthAccess.update(
                                        { needsReauthorization: true },
                                        { where: { teamId: oauth.teamId } }
                                    )

                                    throw new Error(
                                        `Authorization failed for teamId: ${oauth.teamId}. Please reauthorize.`
                                    )
                                } else {
                                    throw error // Rethrow if it's not a token expiration issue
                                }
                            }

                            // Process the posted response if successful
                            if (postedResponse) {
                                console.log(postedResponse)
                                await WorkspaceUser.update(
                                    {
                                        postedTimestamp: postedResponse?.ts,
                                        channelId: postedResponse?.channel,
                                    },
                                    {
                                        where: { userId: user.userId },
                                    }
                                )
                            }
                        } catch (error) {
                            console.error('Post message issue:', error)
                            console.error(
                                'Post message issue userID:',
                                user.userId
                            )
                        }
                    }
                }
            })
        }
    } catch (err) {
        console.log(err)
    }
}

exports.InitializeSlackOauth = async (installation) => {
    const oAuth = {
        teamId: installation?.team.id,
        teamName: installation?.team.name,
        enterprise: installation?.enterprise,
        isEnterpriseInstall: installation?.isEnterpriseInstall,
        userToken: installation?.user?.token,
        userId: installation?.user?.id,
        userRefreshToken: installation?.user?.refreshToken,
        userExpiresAt: installation?.user?.expiresAt,
        tokenType: installation?.tokenType,
        botToken: installation?.bot?.token,
        botId: installation?.bot?.id,
        botRefreshToken: installation?.bot?.refreshToken,
        botExpiresAt: installation?.bot?.expiresAt,
        needsReauthorization: false,
    }

    //ifExistToken
    const token = await SlackOAuthAccess.findAll({
        where: { teamId: installation?.team.id },
    })

    if (token.length === 0) {
        const slackOAuth = await SlackOAuthController.create(oAuth)
            .then(async (result) => {
                const userList = await slackService.listUsers(
                    result.botToken,
                    result.teamId
                )

                if (userList?.members.length > 0) {
                    const filteredUsers = userList?.members.filter(
                        (user) =>
                            user.is_email_confirmed === true &&
                            user.deleted === false
                    )
                    const bulkWorkspaceUser = []
                    filteredUsers.forEach(async (user) => {
                        bulkWorkspaceUser.push({
                            userId: user.id,
                            teamId: user.team_id,
                            name: user.name,
                            email: user.profile?.email,
                            isAdmin: user.is_admin,
                            isOwner: user.is_owner,
                            postedTimestamp: '',
                            channelId: '',
                        })
                    })

                    const workspaceUser =
                        await WorkspaceUser.bulkCreate(bulkWorkspaceUser)

                    if (workspaceUser) {
                        await WorkspaceUserController.findAll()
                            .then(async (res) => {
                                await res.forEach(async (user) => {
                                    SlackOAuthController.addWorkspaceUser(
                                        result.id,
                                        user.id
                                    )
                                })
                            })
                            .catch((err) => {
                                console.log(
                                    '>> Error while creating oAuthWorspaceUser: ',
                                    err
                                )
                            })
                    }
                }
            })
            .catch((err) => {
                console.log('>> Error while creating oAuth: ', err)
            })
    } else if (token.length > 0) {
        const slackOAuth = await SlackOAuthAccess.update(oAuth, {
            where: { teamId: installation?.team.id },
        })
            .then(async (result) => {
                const userList = await slackService.listUsers(
                    result.botToken,
                    result.teamId
                )

                if (userList?.members.length > 0) {
                    const filteredUsers = userList?.members.filter(
                        (user) =>
                            user.is_email_confirmed === true &&
                            user.deleted === false
                    )
                    const bulkWorkspaceUser = []
                    filteredUsers.forEach(async (user) => {
                        bulkWorkspaceUser.push({
                            userId: user.id,
                            teamId: user.team_id,
                            name: user.name,
                            email: user.profile?.email,
                            isAdmin: user.is_admin,
                            isOwner: user.is_owner,
                            postedTimestamp: '',
                            channelId: '',
                        })
                    })

                    const existingWorkspaceUsers = await WorkspaceUser.findAll({
                        where: { teamId: result.teamId },
                    })

                    const existingWorkspaceUserIds = existingWorkspaceUsers.map(
                        (user) => user.userId
                    )

                    const newWorkspaceUsers = bulkWorkspaceUser.filter(
                        (user) =>
                            !existingWorkspaceUserIds.includes(user.userId)
                    )

                    const workspaceUser =
                        await WorkspaceUser.bulkCreate(newWorkspaceUsers)

                    if (workspaceUser) {
                        await WorkspaceUserController.findAll()
                            .then(async (res) => {
                                await res.forEach(async (user) => {
                                    SlackOAuthController.addWorkspaceUser(
                                        result.id,
                                        user.id
                                    )
                                })
                            })
                            .catch((err) => {
                                console.log(
                                    '>> Error while creating oAuthWorspaceUser: ',
                                    err
                                )
                            })
                    }
                }
            })
            .catch((err) => {
                console.log('>> Error while creating oAuth: ', err)
            })
    } else {
        throw new Error('>> Already exist oAuth:')
    }
}

exports.deleteDailySurveyPostings = async () => {
    try {
        const workspaceUsers = await WorkspaceUser.findAll({
            where: {
                postedTimestamp: {
                    [Op.ne]: null,
                },
            },
        })

        if (workspaceUsers) {
            workspaceUsers.forEach(async (workspaceUser) => {
                try {
                    let token
                    await slackService
                        .authorize(workspaceUser?.teamId)
                        .then((res) => {
                            token = res.botToken
                        })
                        .catch((err) => {
                            throw new Error('Failed authorize token', err)
                        })
                    await webClient.chat.delete({
                        token: token,
                        channel: workspaceUser.channelId,
                        ts: workspaceUser.postedTimestamp,
                    })
                } catch (error) {
                    console.error(
                        `>> Error deleting message workspace user: ${workspaceUser.id}`,
                        error
                    )
                }
            })
        }
    } catch (error) {
        console.log('>> Error while deleting daily survey postings:', error)
    }
}
