'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
    class communications extends Model {
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
    communications.init(
        {
            sharedCalendarEvent: DataTypes.INTEGER,
            sendMailFrequency: DataTypes.INTEGER,
            communicationScore: DataTypes.FLOAT,
            userId: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: 'communications',
        }
    )
    return communications
}
