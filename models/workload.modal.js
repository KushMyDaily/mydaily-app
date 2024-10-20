'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
    class workload extends Model {
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
    workload.init(
        {
            hoursOfMeetings: DataTypes.FLOAT,
            sentMail: DataTypes.INTEGER,
            inboxMail: DataTypes.INTEGER,
            unreadMail: DataTypes.INTEGER,
            importantMail: DataTypes.INTEGER,
            workloadScore: DataTypes.FLOAT,
            userId: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: 'workload',
        }
    )
    return workload
}
