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
                    title: 'Workload 03',
                    question: 'How in control do you feel over your task load?',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: 4,
                    title: 'Workload 04',
                    question: 'How do you feel about your workload difficulty?',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: 5,
                    title: 'Time Boundaries 01',
                    question:
                        'How easily can you disconnect from work during off-hours?',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: 6,
                    title: 'Time Boundaries 02',
                    question:
                        'How well can you maintain your scheduled work hours without overtime?',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: 7,
                    title: 'Time Boundaries 03',
                    question:
                        'How would you rate your ability to take short breaks during your workday?',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: 8,
                    title: 'Time Boundaries 04',
                    question: 'How is your work life balance?',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: 9,
                    title: 'Relationships 01',
                    question:
                        'How would you rate your relationship with your manager?',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: 10,
                    title: 'Relationships 02',
                    question:
                        'How effective is the feedback from your manager?',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: 11,
                    title: 'Relationships 03',
                    question:
                        'How connected do you feel with your team members?',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: 12,
                    title: 'Relationships 04',
                    question: 'How valued do you feel by your colleagues?',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: 13,
                    title: 'Sense of Autonomy 01',
                    question: 'How free do you feel to decide how you work?',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: 14,
                    title: 'Sense of Autonomy 02',
                    question: 'How trusted do you feel to make decisions?',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: 15,
                    title: 'Sense of Autonomy 03',
                    question: 'How valued are your opinions at work?',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: 16,
                    title: 'Sense of Autonomy 04',
                    question:
                        'What is your ability to choose what you work on?',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: 17,
                    title: 'Communication 01',
                    question:
                        'How clear are instructions and expectations at work?',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: 18,
                    title: 'Communication 02',
                    question: 'How are your ideas acknowledged?',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: 19,
                    title: 'Communication 03',
                    question: 'How effective is team communication?',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: 20,
                    title: 'Communication 04',
                    question: 'How are your concerns acknowledged?',
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
