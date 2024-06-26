'use strict'
// const sequelizePaginate = require('sequelize-paginate')
module.exports = (sequelize, DataTypes) => {
    const SurveyAnswer = sequelize.define('survey_answers', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        answers: DataTypes.TEXT,
        surveyId: DataTypes.INTEGER,
        userId: DataTypes.INTEGER,
    })

    SurveyAnswer.associate = function (models) {
        SurveyAnswer.belongsTo(models.user)
        SurveyAnswer.belongsTo(models.survey)
    }
    return SurveyAnswer
}
