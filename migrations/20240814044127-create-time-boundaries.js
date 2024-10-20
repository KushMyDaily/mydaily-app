'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('time_boundaries', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            outsideWorkHours: {
                type: Sequelize.INTEGER,
            },
            conflictMeetings: {
                type: Sequelize.INTEGER,
            },
            emailSentOutside: {
                type: Sequelize.INTEGER,
            },
            timeBoundariesScore: {
                type: Sequelize.FLOAT,
            },
            userId: {
                type: Sequelize.INTEGER,
            },
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
        await queryInterface.dropTable('time_boundaries')
    },
}
