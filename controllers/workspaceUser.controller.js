const db = require('../models')
const SlackOAuthAccess = db.slackOAuthAccess
const WorkspaceUser = db.workspaceUser

exports.create = (workspaceUser) => {
    return WorkspaceUser.create({
        userId: workspaceUser.userId,
        teamId: workspaceUser.teamId,
        name: workspaceUser.name,
        email: workspaceUser.email,
        isAdmin: workspaceUser.isAdmin,
        isOwner: workspaceUser.isOwner,
    })
        .then((workspaceUser) => {
            console.log(
                '>> Created workspaceUser: ' +
                    JSON.stringify(workspaceUser, null, 4)
            )
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
