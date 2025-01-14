'use strict'
// const sequelizePaginate = require('sequelize-paginate')
module.exports = (sequelize, DataTypes) => {
    const SlackOAuthAccess = sequelize.define('slack_oauth_accesses', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        teamId: {
            type: DataTypes.STRING,
        },
        teamName: {
            type: DataTypes.STRING,
        },
        enterprise: {
            type: DataTypes.STRING,
        },
        isEnterpriseInstall: {
            type: DataTypes.BOOLEAN,
        },
        userToken: {
            type: DataTypes.STRING,
        },
        userId: {
            type: DataTypes.STRING,
        },
        userRefreshToken: {
            type: DataTypes.STRING,
        },
        userExpiresAt: {
            type: DataTypes.INTEGER,
        },
        tokenType: {
            type: DataTypes.STRING,
        },
        botToken: {
            type: DataTypes.STRING,
        },
        botId: {
            type: DataTypes.STRING,
        },
        botRefreshToken: {
            type: DataTypes.STRING,
        },
        botExpiresAt: {
            type: DataTypes.INTEGER,
        },
        needsReauthorization: {
            type: DataTypes.BOOLEAN,
        },
    })

    // SlackOAuthAccess.associate = function (models) {
    //     SlackOAuthAccess.belongsToMany(models.workspaceUser, {
    //         through: 'oAuth_workspaces',
    //         foreignKey: 'slackOAuthId',
    //         otherKey: 'workspaceId',
    //     })
    // }
    return SlackOAuthAccess
}
