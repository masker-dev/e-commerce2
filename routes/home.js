const express = require('express');
const route = express.Router();
// const protectUser = require('../protect/userProtect')
const PRODUCTS = require('../models/productModel');
const CARDS = require("../models/cardModel");

route.get('/',(req, res)=>{
    console.log(`the user is ${req.session.userId} isAdmin: ${req.session.isAdmin}`);
    PRODUCTS.find().then((doc)=>{
        CARDS.countDocuments({userId: req.session.userId},(err, count)=>{
            res.render('home',{
                title: 'Home',
                isUser: req.session.userId,
                isAdmin: req.session.isAdmin,
                products: doc,
                cardItems: count
            })
        })
        
    }).catch((err)=>{
        res.send(err)
    })
});

route.get('/Products', (req, res) => {
    PRODUCTS.find().then((doc) => {
        CARDS.countDocuments({userId: req.session.userId},(err, count)=>{
            res.render('products', {
                title: 'products',
                products: doc,
                isUser: req.session.userId,
                isAdmin: req.session.isAdmin,
                cardItems: count
            })

        })
    })
})

module.exports = route