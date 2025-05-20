'use strict'
// const sequelizePaginate = require('sequelize-paginate')
module.exports = (sequelize, DataTypes) => {
    const WorkspaceUser = sequelize.define('workspace_users', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        userId: DataTypes.STRING,
        teamId: DataTypes.STRING,
        name: DataTypes.STRING,
        email: DataTypes.STRING,
        isAdmin: DataTypes.BOOLEAN,
        isOwner: DataTypes.BOOLEAN,
        postedTimestamp: DataTypes.STRING,
        channelId: DataTypes.STRING,
    })
    return WorkspaceUser
}
