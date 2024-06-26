'use strict'
// const sequelizePaginate = require('sequelize-paginate')
module.exports = (sequelize, DataTypes) => {
    const Question = sequelize.define('questions', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        title: DataTypes.STRING,
        question: DataTypes.STRING,
    })

    Question.associate = function (models) {
        Question.belongsToMany(models.survey, {
            through: 'survey_questions',
            foreignKey: 'questionsId',
            otherKey: 'surveyId',
        })
    }
    return Question
}
