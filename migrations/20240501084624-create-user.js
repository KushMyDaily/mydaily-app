'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        /**
         * Add altering commands here.
         *
         * Example:
         * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
         */
        await queryInterface.createTable('users', {
            id: {
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
                type: Sequelize.INTEGER,
            },
            username: {
                type: Sequelize.STRING,
            },
            email: {
                type: Sequelize.STRING,
                required: true,
                unique: true,
            },
            password: {
                type: Sequelize.STRING,
                required: true,
                allowNull: false,
            },
            companyId: {
                type: Sequelize.INTEGER,
            },
            slackId: {
                type: Sequelize.STRING,
            },
            postedTimestamp: {
                type: Sequelize.STRING,
            },
            channelId: {
                type: Sequelize.STRING,
            },
            workspaceUserIds: {
                type: Sequelize.STRING,
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
        /**
         * Add reverting commands here.
         *
         * Example:
         * await queryInterface.dropTable('users');
         */
        await queryInterface.dropTable('users')
    },
}
