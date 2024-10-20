'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('workloads', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            hoursOfMeetings: {
                type: Sequelize.FLOAT,
            },
            sentMail: {
                type: Sequelize.INTEGER,
            },
            inboxMail: {
                type: Sequelize.INTEGER,
            },
            unreadMail: {
                type: Sequelize.INTEGER,
            },
            importantMail: {
                type: Sequelize.INTEGER,
            },
            workloadScore: {
                type: Sequelize.FLOAT,
            },
            userId: { type: Sequelize.INTEGER },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
        })
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('workloads')
    },
}
