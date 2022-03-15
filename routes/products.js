const express = require('express');
const route = express.Router();

const PRODUCTS = require('../models/productModel');
const CARDS = require('../models/cardModel')

route.get('/:id', (req, res)=>{
    PRODUCTS.findOne({_id:req.params.id})
    .then((doc)=>{
        CARDS.countDocuments({userId: req.session.userId},(err, count)=>{
            
            res.render('product',{
                title: doc.name,
                product: doc,
                isUser: req.session.userId,
                isAdmin: req.session.isAdmin,
                cardItems: count
            })
        })
        
    })
})

module.exports = route;