'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
    class dataPoints extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            this.belongsTo(models.factor, {
                foreignKey: 'factorId',
                targetKey: 'id',
            })
            this.hasOne(models.scoreMapping, {
                foreignKey: 'dataPointId',
                targetKey: 'id',
            })
        }
    }
    dataPoints.init(
        {
            name: DataTypes.STRING,
            factorId: DataTypes.INTEGER,
            weight: DataTypes.FLOAT,
        },
        {
            sequelize,
            modelName: 'data_points',
        }
    )
    return dataPoints
}
