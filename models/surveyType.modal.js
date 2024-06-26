'use strict'
// const sequelizePaginate = require('sequelize-paginate')
module.exports = (sequelize, DataTypes) => {
    const SurveyType = sequelize.define('survey_types', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        type: DataTypes.STRING,
    })

    SurveyType.associate = function (models) {
        SurveyType.hasOne(models.survey, {
            foreignKey: 'surveyTypeId',
            targetKey: 'id',
        })
    }
    return SurveyType
}
