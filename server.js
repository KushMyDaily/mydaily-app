// server/index.js

const express = require('express')
const cors = require('cors')

const app = express()

const PORT = 3001

const corsOptions = {
    origin: 'http://13.43.110.169:3001',
    credentials: true, //access-control-allow-credentials:true
    optionSuccessStatus: 200,
}

app.use(cors(corsOptions))

// parse requests of content-type - application/json
app.use(express.json())

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }))

// database
const db = require('./models')
// const Role = db.role

db.sequelize.sync()
// force: true will drop the table if it already exists
// db.sequelize.sync({force: true}).then(() => {
//   console.log('Drop and Resync Database with { force: true }');
//   initial();
// });

// simple route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to ItsMyDaily application.' })
})

// routes
require('./routes/auth.routes')(app)
require('./routes/user.routes')(app)

app.get('/api/users', (req, res) => {
    return res.json('user')
})

// eslint-disable-next-line no-console
app.listen(PORT, () => console.log(`Listening on port ${PORT}`))
