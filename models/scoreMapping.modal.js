'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
    class scoreMapping extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            this.belongsTo(models.dataPoints, {
                foreignKey: 'dataPointId',
                targetKey: 'id',
            })
        }
    }
    scoreMapping.init(
        {
            scoreRange: DataTypes.STRING,
            score: DataTypes.STRING,
            dataPointId: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: 'score_mapping',
        }
    )
    return scoreMapping
}
