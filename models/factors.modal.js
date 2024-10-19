'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
    class factor extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            this.hasOne(models.dataPoints, {
                foreignKey: 'factorId',
                targetKey: 'id',
            })
        }
    }
    factor.init(
        {
            name: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: 'factor',
        }
    )
    return factor
}
