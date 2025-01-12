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
        const slackOauths = await SlackOAuthAccess.findAll()

        if (!slackOauths || slackOauths.length === 0) {
            console.log('No OAuth records found.')
            return
        }

        for (const oauth of slackOauths) {
            try {
                const authResult = await slackService.authorize(oauth.teamId)
                const token =
                    oauth.tokenType === 'bot'
                        ? authResult.botToken
                        : authResult.userToken

                const filteredWorkspaceUsers = await Promise.all(
                    oauth.workspace_users.map(async (workspaceUser) => {
                        const rows = await User.findAll({
                            where: {
                                [Op.or]: [
                                    { workspaceUserIds: workspaceUser.id },
                                    {
                                        [Op.and]: [
                                            {
                                                workspaceUserIds: {
                                                    [Op.ne]: null,
                                                },
                                            },
                                            {
                                                workspaceUserIds: {
                                                    [Op.ne]: '',
                                                },
                                            },
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

                        return rows.length > 0 ? workspaceUser : null
                    })
                )

                const validWorkspaceUsers = filteredWorkspaceUsers.filter(
                    (user) => user !== null
                )

                for (const user of validWorkspaceUsers) {
                    try {
                        const webClient = new WebClient(token)

                        const postedResponse = await webClient.chat.postMessage(
                            {
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
                                            text: 'Please take a moment to fill out today survey.',
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
                            }
                        )

                        if (postedResponse) {
                            await WorkspaceUser.update(
                                {
                                    postedTimestamp: postedResponse.ts,
                                    channelId: postedResponse.channel,
                                },
                                {
                                    where: { userId: user.userId },
                                }
                            )
                        }
                    } catch (error) {
                        console.error(
                            'Error posting message to user:',
                            user.userId,
                            error
                        )
                    }
                }
            } catch (authError) {
                console.error(
                    'Authorization error for teamId:',
                    oauth.teamId,
                    authError
                )
            }
        }
    } catch (err) {
        console.error('runSurvey error:', err)
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
    } else {
        throw new Error('>> Already exist oAuth:')
    }
}
