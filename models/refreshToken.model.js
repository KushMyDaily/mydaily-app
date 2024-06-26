'use strict'
const config = require('../config/auth.config')
const { v4: uuidv4 } = require('uuid')

// const sequelizePaginate = require('sequelize-paginate')
module.exports = (sequelize, DataTypes) => {
    const RefreshToken = sequelize.define('refreshToken', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        token: DataTypes.STRING,
        expiryDate: DataTypes.DATE,
        userId: DataTypes.INTEGER,
    })

    RefreshToken.createToken = async function (user) {
        let expiredAt = new Date()

        expiredAt.setSeconds(
            expiredAt.getSeconds() + config.jwtRefreshExpiration
        )

        let _token = uuidv4()

        let refreshToken = await this.create({
            token: _token,
            userId: user.id,
            expiryDate: expiredAt.getTime(),
        })

        return refreshToken.token
    }

    RefreshToken.verifyExpiration = (token) => {
        return token.expiryDate.getTime() < new Date().getTime()
    }

    RefreshToken.associate = function (models) {
        RefreshToken.belongsTo(models.user, {
            foreignKey: 'userId',
            targetKey: 'id',
        })
    }
    return RefreshToken
}
