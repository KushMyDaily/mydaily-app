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
                'fullname', // new field name
                {
                    type: Sequelize.STRING,
                    allowNull: true,
                }
            ),
            queryInterface.addColumn(
                'users', // table name
                'manager', // new field name
                {
                    type: Sequelize.STRING,
                    allowNull: true,
                }
            ),
            queryInterface.addColumn(
                'users', // table name
                'position', // new field name
                {
                    type: Sequelize.STRING,
                    allowNull: true,
                }
            ),
            queryInterface.addColumn(
                'users', // table name
                'birthday', // new field name
                {
                    type: Sequelize.DATE,
                    allowNull: true,
                }
            ),
            queryInterface.addColumn(
                'users', // table name
                'gender', // new field name
                {
                    type: Sequelize.STRING,
                    allowNull: true,
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
            queryInterface.removeColumn('users', 'fullname'),
            queryInterface.removeColumn('users', 'manager'),
            queryInterface.removeColumn('users', 'position'),
            queryInterface.removeColumn('users', 'birthday'),
            queryInterface.removeColumn('users', 'gender'),
        ])
    },
}
