const express = require('express');
const route = express.Router();
const userProtect = require('../protect/userProtect');
const controller = require('../controller/ordersCont')


route.get('/',userProtect.isAuth,controller.getOrders);
route.get('/test', controller.test);
route.get('/details/:id', userProtect.isAuth, controller.getOrderDetails)

module.exports = route