'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
    class statisticsByDate extends Model {
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
    statisticsByDate.init(
        {
            workload: DataTypes.FLOAT,
            relationship: DataTypes.FLOAT,
            timeBoundaries: DataTypes.FLOAT,
            autonomy: DataTypes.FLOAT,
            communication: DataTypes.FLOAT,
            wellbeingScore: DataTypes.FLOAT,
            yourForm: DataTypes.FLOAT,
            userId: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: 'statistics_by_date',
        }
    )
    return statisticsByDate
}
