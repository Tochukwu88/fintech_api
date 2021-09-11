const express = require('express');
const app = express()
const morgan = require('morgan')


const { sequelize } = require('./models/index')
const authRoutes = require('./routes/auth')
const userRoutes = require('./routes/user');
const { errorResponse } = require('./utils/responseHandler');

app.use(morgan('dev'))
require('dotenv').config()


app.use(express.json());
app.use('/auth',authRoutes)
app.use('/user',userRoutes)
app.use('*', (req, res) => {
    return errorResponse(res, "route not found", 404)
})


const port = process.env.PORT || 8000
app.listen(port, async () => {
    try {
        console.log('server started')
        await sequelize.authenticate();
        console.log('Connection has been established successfully.')
    } catch (error) {
        console.log('Unable to connect to the database:', error);
    }
})
module.exports = app