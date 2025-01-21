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
                    question: 'How manageable does your workload feel?',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: 2,
                    title: 'Workload 02',
                    question:
                        'Do you feel you have enough time to complete your tasks?',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: 3,
                    title: 'Workload 03',
                    question:
                        'To what extent do you feel in control of your workload?',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: 4,
                    title: 'Workload 04',
                    question:
                        'How comfortable are you with the complexity of your tasks?',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: 5,
                    title: 'Time Boundaries 01',
                    question:
                        'How easy is it for you to disconnect from work during your personal time?',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: 6,
                    title: 'Time Boundaries 02',
                    question:
                        'Do you feel you maintain a healthy balance between work and personal time?',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: 7,
                    title: 'Time Boundaries 03',
                    question:
                        'Are you able to take sufficient breaks during your workday?',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: 8,
                    title: 'Time Boundaries 04',
                    question:
                        'How satisfied are you with your work-life balance?',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: 9,
                    title: 'Relationships 01',
                    question: 'How supported do you feel by your manager?',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: 10,
                    title: 'Relationships 02',
                    question:
                        'How helpful is the feedback you receive from your manager?',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: 11,
                    title: 'Relationships 03',
                    question:
                        'Do you feel your manager is available when you need assistance?',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: 12,
                    title: 'Relationships 04',
                    question:
                        'Do you feel clear about what is expected of you?',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: 13,
                    title: 'Sense of Autonomy 01',
                    question:
                        'Do you feel you have enough freedom in deciding how to do your work?',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: 14,
                    title: 'Sense of Autonomy 02',
                    question:
                        'Do you feel trusted to make decisions related to your work?',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: 15,
                    title: 'Sense of Autonomy 03',
                    question:
                        'Do you have the opportunity to choose or prioritize your tasks?',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: 16,
                    title: 'Sense of Autonomy 04',
                    question:
                        'How valued do you feel your opinions are when decisions are made?',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: 17,
                    title: 'Communication 01',
                    question:
                        'Does the information you receive help you perform your tasks effectively?',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: 18,
                    title: 'Communication 02',
                    question:
                        'How satisfied are you with the communication within your team?',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: 19,
                    title: 'Communication 03',
                    question:
                        'Do you feel heard when you share your thoughts or concerns?',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: 20,
                    title: 'Communication 04',
                    question:
                        'How valued do you feel when sharing ideas with your team?',
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
