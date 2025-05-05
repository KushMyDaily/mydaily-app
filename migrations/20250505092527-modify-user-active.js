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
        queryInterface.addColumn(
            'users', // table name
            'inactive', // new field name
            {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
            }
        ),
            queryInterface.addColumn(
                'users', // table name
                'unsubscribe', // new field name
                {
                    type: Sequelize.BOOLEAN,
                    defaultValue: false,
                }
            )
    },

    async down(queryInterface, Sequelize) {
        /**
         * Add reverting commands here.
         *
         * Example:
         * await queryInterface.dropTable('users');
         */
        return Promise.all([
            queryInterface.removeColumn('users', 'inactive'),
            queryInterface.removeColumn('users', 'unsubscribe'),
        ])
    },
}
