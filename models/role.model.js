'use strict'
// const sequelizePaginate = require('sequelize-paginate')
module.exports = (sequelize, DataTypes) => {
    const Role = sequelize.define('roles', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        name: DataTypes.STRING,
    })

    Role.associate = function (models) {
        Role.belongsToMany(models.user, {
            through: 'user_roles',
            foreignKey: 'roleId',
            otherKey: 'userId',
        })
    }
    return Role
}
