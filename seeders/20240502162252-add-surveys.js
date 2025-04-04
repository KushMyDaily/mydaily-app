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
            'surveys',
            [
                {
                    id: 1,
                    name: 'Monday week 1',
                    surveyTypeId: 1,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: 2,
                    name: 'Monday week 2',
                    surveyTypeId: 1,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: 3,
                    name: 'Monday week 3',
                    surveyTypeId: 1,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: 4,
                    name: 'Monday week 4',
                    surveyTypeId: 1,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: 5,
                    name: 'Tuesday week 1',
                    surveyTypeId: 1,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: 6,
                    name: 'Tuesday week 2',
                    surveyTypeId: 1,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: 7,
                    name: 'Tuesday week 3',
                    surveyTypeId: 1,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: 8,
                    name: 'Tuesday week 4',
                    surveyTypeId: 1,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: 9,
                    name: 'Wednesday week 1',
                    surveyTypeId: 1,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: 10,
                    name: 'Wednesday week 2',
                    surveyTypeId: 1,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: 11,
                    name: 'Wednesday week 3',
                    surveyTypeId: 1,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: 12,
                    name: 'Wednesday week 4',
                    surveyTypeId: 1,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: 13,
                    name: 'Thursday week 1',
                    surveyTypeId: 1,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: 14,
                    name: 'Thursday week 2',
                    surveyTypeId: 1,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: 15,
                    name: 'Thursday week 3',
                    surveyTypeId: 1,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: 16,
                    name: 'Thursday week 4',
                    surveyTypeId: 1,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: 17,
                    name: 'Friday week 1',
                    surveyTypeId: 1,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: 18,
                    name: 'Friday week 2',
                    surveyTypeId: 1,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: 19,
                    name: 'Friday week 3',
                    surveyTypeId: 1,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: 20,
                    name: 'Friday week 4',
                    surveyTypeId: 1,
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
        await queryInterface.bulkDelete('surveys', null, {})
    },
}
