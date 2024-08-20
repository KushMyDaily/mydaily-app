'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
    class timeBoundaries extends Model {
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
    timeBoundaries.init(
        {
            outsideWorkHours: DataTypes.INTEGER,
            conflictMeetings: DataTypes.INTEGER,
            emailSentOutside: DataTypes.INTEGER,
            timeBoundariesScore: DataTypes.FLOAT,
            userId: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: 'time_boundaries',
        }
    )
    return timeBoundaries
}
