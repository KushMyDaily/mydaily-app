'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        /**
         * Add seed commands here.
         *
         * Example:
         * await queryInterface.bulkInsert('People', [{
         *   name: 'John Doe',
         *   isBetaMember: false
         * }], {});
         */
        await queryInterface.bulkInsert(
            'survey_questions',
            [
                {
                    surveyId: 1,
                    questionId: 1,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    surveyId: 2,
                    questionId: 2,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    surveyId: 3,
                    questionId: 3,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    surveyId: 4,
                    questionId: 4,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    surveyId: 5,
                    questionId: 5,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    surveyId: 6,
                    questionId: 6,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    surveyId: 7,
                    questionId: 7,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    surveyId: 8,
                    questionId: 8,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    surveyId: 9,
                    questionId: 9,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    surveyId: 10,
                    questionId: 10,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    surveyId: 11,
                    questionId: 11,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    surveyId: 12,
                    questionId: 12,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    surveyId: 13,
                    questionId: 13,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    surveyId: 14,
                    questionId: 14,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    surveyId: 15,
                    questionId: 15,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    surveyId: 16,
                    questionId: 16,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    surveyId: 17,
                    questionId: 17,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    surveyId: 18,
                    questionId: 18,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    surveyId: 19,
                    questionId: 19,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    surveyId: 20,
                    questionId: 20,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            ],
            {}
        )
    },

    async down(queryInterface, Sequelize) {
        /**
         * Add commands to revert seed here.
         *
         * Example:
         * await queryInterface.bulkDelete('People', null, {});
         */
        await queryInterface.bulkDelete('survey_questions', null, {})
    },
}
