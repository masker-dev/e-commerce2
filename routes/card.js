const express = require('express');
const route = express.Router();
const userProtect = require('../protect/userProtect');
const bodyParser = require('body-parser').urlencoded({ extended: false });
// const joi = require('joi');
// const CARDS = require('../models/cardModel');
// const ORDERS = require('../models/orderModel');
const controller = require('../controller/cardCont')
const { check, validationResult } = require('express-validator')



route.get('/', userProtect.isAuth, controller.getCard)
route.post('/', userProtect.isAuth, bodyParser, controller.addToCard);
route.post('/delete', userProtect.isAuth, bodyParser, controller.deleteFromCard);


route.post('/addOrder',
    userProtect.isAuth,
    bodyParser,
    check('name','name is required').notEmpty().isString(),
    check('address', 'address is required').notEmpty(),
    check('phones[0]', 'phones is required').notEmpty(),
    check('phones[1]', 'phones is required').notEmpty(),
    check('phones[0]', 'phone 1 must be number').isNumeric(),
    check('phones[1]', 'phone 2 must be number').isNumeric(),
    check('status', 'status is required').notEmpty(),
    check('orderDate','order Date is required').notEmpty(),
    controller.PostOrder)


module.exports = route;