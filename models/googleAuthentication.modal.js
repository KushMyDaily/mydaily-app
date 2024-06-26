'use strict'

// const sequelizePaginate = require('sequelize-paginate')
module.exports = (sequelize, DataTypes) => {
    const GoogleAuth = sequelize.define('google_auths', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        accessToken: DataTypes.STRING,
        refreshToken: DataTypes.STRING,
        expiryDate: DataTypes.BIGINT,
        userId: DataTypes.INTEGER,
    })

    GoogleAuth.associate = function (models) {
        GoogleAuth.belongsTo(models.user, {
            foreignKey: 'userId',
            targetKey: 'id',
        })
    }
    return GoogleAuth
}
