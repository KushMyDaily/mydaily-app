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
            'data_points',
            [
                {
                    id: 1,
                    name: 'eventHour',
                    factorId: 1,
                    weight: 0.4,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: 2,
                    name: 'sentMail',
                    factorId: 1,
                    weight: 0.2,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: 3,
                    name: 'inboxMail',
                    factorId: 1,
                    weight: 0.15,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: 4,
                    name: 'unreadMail',
                    factorId: 1,
                    weight: 0.15,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: 5,
                    name: 'importantMail',
                    factorId: 1,
                    weight: 0.1,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: 6,
                    name: 'meetingAttendees',
                    factorId: 2,
                    weight: 0.45,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: 7,
                    name: 'oneToOneManager',
                    factorId: 2,
                    weight: 0.4,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: 8,
                    name: 'emailRecipients',
                    factorId: 2,
                    weight: 0.15,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: 9,
                    name: 'outsideWorkHours',
                    factorId: 3,
                    weight: 0.6,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: 10,
                    name: 'conflictMeetings',
                    factorId: 3,
                    weight: 0.1,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: 11,
                    name: 'emailSentOutside',
                    factorId: 3,
                    weight: 0.3,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: 12,
                    name: 'eventCreatedByUser',
                    factorId: 4,
                    weight: 0.6,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: 13,
                    name: 'initiatedEmailThreads',
                    factorId: 4,
                    weight: 0.4,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: 14,
                    name: 'sharedCalendarEvent',
                    factorId: 5,
                    weight: 0.75,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: 15,
                    name: 'sendMailFrequency',
                    factorId: 5,
                    weight: 0.25,
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
        await queryInterface.bulkDelete('data_points', null, {})
    },
}
