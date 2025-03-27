'use strict'
// const sequelizePaginate = require('sequelize-paginate')
module.exports = (sequelize, DataTypes) => {
    const Company = sequelize.define('company', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        name: DataTypes.STRING,
        domain: DataTypes.STRING,
        subscriptions: DataTypes.INTEGER,
        status: DataTypes.BOOLEAN,
    })

    Company.associate = function (models) {
        Company.hasMany(models.user, {
            foreignKey: 'companyId',
            targetKey: 'id',
            as: 'users',
        })
    }

    return Company
}
