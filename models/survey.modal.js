'use strict'
// const sequelizePaginate = require('sequelize-paginate')
module.exports = (sequelize, DataTypes) => {
    const Survey = sequelize.define('surveys', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        name: DataTypes.STRING,
        surveyTypeId: DataTypes.INTEGER,
    })

    Survey.associate = function (models) {
        Survey.belongsToMany(models.question, {
            through: 'survey_questions',
            foreignKey: 'surveyId',
            otherKey: 'questionId',
        })
        // Survey.belongsTo(models.SurveyAnswer, {
        //     foreignKey: 'surveyId',
        //     targetKey: 'id',
        // })
        //Survey.belongsTo(models.SurveyType)
    }
    return Survey
}
