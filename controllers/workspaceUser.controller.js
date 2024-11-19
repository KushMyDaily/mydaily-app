const db = require('../models')
const SlackOAuthAccess = db.slackOAuthAccess
const WorkspaceUser = db.workspaceUser
const User = db.user

exports.create = (workspaceUser) => {
    return WorkspaceUser.create({
        userId: workspaceUser.userId,
        teamId: workspaceUser.teamId,
        name: workspaceUser.name,
        email: workspaceUser.email,
        isAdmin: workspaceUser.isAdmin,
        isOwner: workspaceUser.isOwner,
    })
        .then(async (workspaceUser) => {
            console.log(
                '>> Created workspaceUser: ' +
                    JSON.stringify(workspaceUser, null, 4)
            )
            await updateUsersWorkspaceId(workspaceUser)
            return workspaceUser
        })
        .catch((err) => {
            console.log('>> Error while creating workspaceUser: ', err)
        })
}

exports.findAll = () => {
    return WorkspaceUser.findAll({
        include: [
            {
                model: SlackOAuthAccess,
                as: 'slack_oauth_accesses',
                attributes: [
                    'id',
                    'teamId',
                    'teamName',
                    'enterprise',
                    'isEnterpriseInstall',
                    'userToken',
                    'userId',
                    'userRefreshToken',
                    'userExpiresAt',
                    'tokenType',
                    'botToken',
                    'botId',
                    'botRefreshToken',
                    'botExpiresAt',
                ],
                through: {
                    attributes: [],
                },
                // through: {
                //   attributes: ["tag_id", "tutorial_id"],
                // },
            },
        ],
    })
        .then((workspaceUser) => {
            return workspaceUser
        })
        .catch((err) => {
            console.log('>> Error while retrieving WorkspaceUser: ', err)
        })
}

exports.findById = (id) => {
    return WorkspaceUser.findByPk(id, {
        include: [
            {
                model: SlackOAuthAccess,
                as: 'slack_oauth_accesses',
                attributes: [
                    'id',
                    'teamId',
                    'teamName',
                    'enterprise',
                    'isEnterpriseInstall',
                    'userToken',
                    'userId',
                    'userRefreshToken',
                    'userExpiresAt',
                    'tokenType',
                    'botToken',
                    'botId',
                    'botRefreshToken',
                    'botExpiresAt',
                ],
                through: {
                    attributes: [],
                },
                // through: {
                //   attributes: ["tag_id", "tutorial_id"],
                // },
            },
        ],
    })
        .then((workspaceUser) => {
            return workspaceUser
        })
        .catch((err) => {
            console.log('>> Error while finding workspaceUser: ', err)
        })
}

async function updateUsersWorkspaceId(workspaceUser) {
    try {
        const user = await User.findOne({
            where: { email: workspaceUser.email },
        })

        if (user) {
            const workspaceUserIds = user.workspaceUserIds
            if (Array.isArray(workspaceUserIds)) {
                if (!workspaceUserIds.includes(workspaceUser.id)) {
                    await user.update({
                        workspaceUserIds: [
                            ...workspaceUserIds,
                            workspaceUser.id,
                        ],
                    })
                }
            } else if (workspaceUserIds !== workspaceUser.id) {
                await user.update({
                    workspaceUserIds: workspaceUser.id,
                })
            }
        } else {
            console.log('user not found')
        }
    } catch (error) {
        console.log('>> Error while updating user workspace user id: ', error)
    }
}
