const express = require('express');
const route = express.Router();
const controller = require('../../controller/dashboardCont');
const adminProtect = require('../../protect/adminProtect');
const bodyParser = require('body-parser').urlencoded({ extended: false });
const check = require('express-validator').check

route.get('/', adminProtect.isAdmin, controller.getDashboard);
route.get('/addProduct', adminProtect.isAdmin, controller.getAddProduct)
route.post('/addProduct',
//  upload.single('picture'),
 adminProtect.isAdmin, 
 bodyParser,
 check('name').notEmpty().withMessage('name is required'),
 check('description').notEmpty().withMessage('description is required').isString().withMessage('description must be string'),
 check('quantity').notEmpty().withMessage("quantity is required").isNumeric().withMessage('quantity must be Numeric value'),
 check('picture').custom((value,{req})=>{
     if(req.files) return true;
     else throw "image is required"
 }),
controller.postProduct);

route.get('/editProduct/:id',controller.getEditProduct)

route.post('/editProduct/:id', adminProtect.isAdmin,bodyParser,
check('name').notEmpty().withMessage('name is required'),
check('description').notEmpty().withMessage('description is required').isString().withMessage('description must be string'),
check('quantity').notEmpty().withMessage("quantity is required").isNumeric().withMessage('quantity must be Numeric value'),

controller.postEditProduct)

route.get('/deleteProduct/:id', adminProtect.isAdmin, controller.deleteProduct);

module.exports = route