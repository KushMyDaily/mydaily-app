'use strict'
// const sequelizePaginate = require('sequelize-paginate')
module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('users', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        username: DataTypes.STRING,
        email: DataTypes.STRING,
        password: DataTypes.STRING,
        companyId: DataTypes.INTEGER,
        slackId: DataTypes.STRING,
        workspaceUserIds: DataTypes.STRING,
    })

    User.associate = function (models) {
        User.belongsToMany(models.role, {
            through: 'user_roles',
            foreignKey: 'userId',
            otherKey: 'roleId',
        })
        User.hasOne(models.refreshToken, {
            foreignKey: 'userId',
            targetKey: 'id',
        })
        User.hasOne(models.googleAuth, {
            foreignKey: 'userId',
            targetKey: 'id',
        })
        User.belongsTo(models.company)
        // User.belongsTo(models.SurveyAnswer, {
        //     foreignKey: 'userId',
        //     targetKey: 'id',
        // })
    }
    return User
}
