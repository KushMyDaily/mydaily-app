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
            'questions',
            [
                {
                    id: 1,
                    title: 'Workload 01',
                    question:
                        'To what extent are you able to complete tasks within designated work hours?',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: 2,
                    title: 'Workload 02',
                    question:
                        'How effectively can you manage and prioritize your workload?',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: 3,
                    title: 'Time Boundaries 01',
                    question:
                        'How easily can you disconnect from work during off-hours?',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: 4,
                    title: 'Time Boundaries 02',
                    question:
                        'How well can you maintain your scheduled work hours without overtime?',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: 5,
                    title: 'Relationships 01',
                    question:
                        'How would you rate your relationship with your manager?',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: 6,
                    title: 'Relationships 02',
                    question:
                        'How effective is the feedback from your manager?',
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
        await queryInterface.bulkDelete('questions', null, {})
    },
}
