'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
    class relationships extends Model {
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
    relationships.init(
        {
            meetingAttendees: DataTypes.FLOAT,
            oneToOneManager: DataTypes.INTEGER,
            emailRecipients: DataTypes.INTEGER,
            relationshipScore: DataTypes.FLOAT,
            userId: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: 'relationships',
        }
    )
    return relationships
}
