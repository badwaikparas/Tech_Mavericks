const express = require('express');
const allRoutes = express.Router();
const userRouter = require('./allRoutes/user')
const bookingRouter = require('./allRoutes/booking')

allRoutes.use('/user', userRouter)
allRoutes.use('/booking', bookingRouter)

module.exports = allRoutes;