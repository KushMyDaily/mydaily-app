module.exports = (sequelize, Sequelize) => {
    const Company = sequelize.define('company', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
        },
        name: {
            type: Sequelize.STRING,
        },
        domain: {
            type: Sequelize.STRING,
        },
        subscriptions: {
            type: Sequelize.INTEGER,
        },
        status: {
            type: Sequelize.BOOLEAN,
        },
    })

    return Company
}
