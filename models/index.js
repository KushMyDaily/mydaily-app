const config = require('../config/db.config.js')

const Sequelize = require('sequelize')
const sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
    host: config.HOST,
    dialect: config.dialect,
    operatorsAliases: false,

    pool: {
        max: config.pool.max,
        min: config.pool.min,
        acquire: config.pool.acquire,
        idle: config.pool.idle,
    },
})

const db = {}

db.user = require('../models/user.model.js')(sequelize, Sequelize)
db.role = require('../models/role.model.js')(sequelize, Sequelize)
db.refreshToken = require('../models/refreshToken.model.js')(
    sequelize,
    Sequelize
)
db.company = require('../models/company.model.js')(sequelize, Sequelize)
db.question = require('../models/question.modal.js')(sequelize, Sequelize)
db.survey = require('../models/survey.modal.js')(sequelize, Sequelize)
db.surveyAnswer = require('../models/surveyAnswer.modal.js')(
    sequelize,
    Sequelize
)
db.surveyType = require('../models/surveyType.modal.js')(sequelize, Sequelize)
db.workspaceUser = require('../models/workspaceUser.modal.js')(
    sequelize,
    Sequelize
)
db.slackOAuthAccess = require('../models/slackOAuthAccess.modal.js')(
    sequelize,
    Sequelize
)
db.googleAuth = require('../models/googleAuthentication.modal.js')(
    sequelize,
    Sequelize
)

///////////////////////////////////////////////////////////////

db.slackOAuthAccess.belongsToMany(db.workspaceUser, {
    through: 'oAuth_workspaces',
    foreignKey: 'slackOAuthId',
    otherKey: 'workspaceId',
})
db.workspaceUser.belongsToMany(db.slackOAuthAccess, {
    through: 'oAuth_workspaces',
    foreignKey: 'workspaceId',
    otherKey: 'slackOAuthId',
})

// db.role.belongsToMany(db.user, {
//     through: 'user_roles',
//     foreignKey: 'roleId',
//     otherKey: 'userId',
// })

// db.user.belongsToMany(db.role, {
//   through: "user_roles",
//   foreignKey: "userId",
//   otherKey: "roleId"
// });

// db.refreshToken.belongsTo(db.user, {
//     foreignKey: 'userId',
//     targetKey: 'id',
// })
// db.user.hasOne(db.refreshToken, {
//   foreignKey: 'userId', targetKey: 'id'
// });

db.ROLES = ['user', 'group admin', 'organization admin', 'super admin']

// db.company.hasOne(db.user, {
//     foreignKey: 'companyId',
//     targetKey: 'id',
// })

Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
        db[modelName].associate(db)
    }
})

db.Sequelize = Sequelize
db.sequelize = sequelize
// db.user.belongsTo(db.company);

module.exports = db
