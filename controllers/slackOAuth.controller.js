const db = require('../models')
const SlackOAuthAccess = db.slackOAuthAccess
const WorkspaceUser = db.workspaceUser

exports.create = (oAuth) => {
    return SlackOAuthAccess.create({
        teamId: oAuth.teamId,
        teamName: oAuth.teamName,
        enterprise: oAuth.enterprise,
        isEnterpriseInstall: oAuth.isEnterpriseInstall,
        userToken: oAuth.userToken,
        userId: oAuth.userId,
        userRefreshToken: oAuth.userRefreshToken,
        userExpiresAt: oAuth.userExpiresAt,
        tokenType: oAuth.tokenType,
        botToken: oAuth.botToken,
        botId: oAuth.botId,
        botRefreshToken: oAuth.botRefreshToken,
        botExpiresAt: oAuth.botExpiresAt,
    })
        .then((oAuth) => {
            console.log(
                '>> Created Slack oAuth: ' + JSON.stringify(oAuth, null, 2)
            )
            return oAuth
        })
        .catch((err) => {
            console.log('>> Error while creating oAuth: ', err)
        })
}

exports.findAll = () => {
    return SlackOAuthAccess.findAll({
        include: [
            {
                model: WorkspaceUser,
                as: 'workspace_users',
                attributes: [
                    'id',
                    'userId',
                    'teamId',
                    'name',
                    'email',
                    'isAdmin',
                    'isOwner',
                ],
                through: {
                    attributes: [],
                },
            },
        ],
    })
        .then((oAuth) => {
            return oAuth
        })
        .catch((err) => {
            console.log('>> Error while retrieving oAuth: ', err)
        })
}

exports.findById = (id) => {
    return SlackOAuthAccess.findByPk(id, {
        include: [
            {
                model: WorkspaceUser,
                as: 'workspace_users',
                attributes: [
                    'id',
                    'userId',
                    'teamId',
                    'name',
                    'email',
                    'isAdmin',
                    'isOwner',
                ],
                through: {
                    attributes: [],
                },
            },
        ],
    })
        .then((oAuth) => {
            return oAuth
        })
        .catch((err) => {
            console.log('>> Error while finding oAuth: ', err)
        })
}

exports.addWorkspaceUser = (oAuthId, workspaceUserId) => {
    return SlackOAuthAccess.findByPk(oAuthId)
        .then((oAuth) => {
            if (!oAuth) {
                console.log('oAuth not found!')
                return null
            }
            return WorkspaceUser.findByPk(workspaceUserId).then(
                (workspaceUser) => {
                    if (!workspaceUser) {
                        console.log('WorkspaceUser not found!')
                        return null
                    }

                    oAuth.addWorkspace_user(workspaceUser)
                    console.log(
                        `>> added workspaceUser id=${workspaceUser.id} to oAuth id=${oAuth.id}`
                    )
                    return oAuth
                }
            )
        })
        .catch((err) => {
            console.log('>> Error while adding workspaceUser to oAuth: ', err)
        })
}
