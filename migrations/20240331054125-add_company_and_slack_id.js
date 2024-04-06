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
                'users', // table name
                'companyId', // new field name
                {
                    type: Sequelize.INTEGER,
                    references: {
                        model: 'companies',
                        key: 'id',
                    },
                }
            ),
            queryInterface.addColumn('users', 'slackId', {
                type: Sequelize.STRING,
            }),
        ])
    },

    async down(queryInterface) {
        /**
         * Add reverting commands here.
         *
         * Example:
         * await queryInterface.dropTable('users');
         */
        return Promise.all([
            queryInterface.removeColumn('users', 'companyId'),
            queryInterface.removeColumn('users', 'slackId'),
        ])
    },
}
