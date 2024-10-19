'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('statistics_by_dates', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            workload: {
                type: Sequelize.FLOAT,
            },
            relationship: {
                type: Sequelize.FLOAT,
            },
            timeBoundaries: {
                type: Sequelize.FLOAT,
            },
            autonomy: {
                type: Sequelize.FLOAT,
            },
            communication: {
                type: Sequelize.FLOAT,
            },
            wellbeingScore: {
                type: Sequelize.FLOAT,
            },
            yourForm: {
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
        await queryInterface.dropTable('statistics_by_dates')
    },
}
