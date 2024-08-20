'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
    class autonomys extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            this.belongsTo(models.user, {
                foreignKey: 'userId',
                targetKey: 'id',
            })
        }
    }
    autonomys.init(
        {
            eventCreatedByUser: DataTypes.INTEGER,
            initiatedEmailThreads: DataTypes.INTEGER,
            autonomyScore: DataTypes.FLOAT,
            userId: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: 'autonomys',
        }
    )
    return autonomys
}
