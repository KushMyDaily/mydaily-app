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
        return Promise.all([
            queryInterface.addColumn(
                'slack_oauth_accesses', // table name
                'needsReauthorization', // new field name
                {
                    type: Sequelize.BOOLEAN,
                    defaultValue: false,
                }
            ),
        ])
    },

    async down(queryInterface, Sequelize) {
        /**
         * Add reverting commands here.
         *
         * Example:
         * await queryInterface.dropTable('users');
         */
        return Promise.all([
            queryInterface.removeColumn(
                'slack_oauth_accesses',
                'needsReauthorization'
            ),
        ])
    },
}
