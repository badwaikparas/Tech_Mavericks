const express = require('express');
const allRoutes = express.Router();
const userRouter = require('../user')
const bookingRouter = require('../user')

allRoutes.use('/user', userRouter)
allRoutes.use('/booking', bookingRouter)

module.exports = { allRoutes };