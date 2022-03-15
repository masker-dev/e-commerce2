const express = require('express');
const route = express.Router();
const bodyParser = require('body-parser')
const urlEncode = bodyParser.urlencoded({ extended: false });
const users = require('../models/userModel');
const bcrypt = require('bcrypt');
const userProtect = require('../protect/userProtect')



// check data if are valid using joi library
const joi = require('joi');
const { object } = require('joi');
const schema = joi.object({

    userName: joi.string().min(3).max(20).required(),
    email: joi.string().required()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
    password: joi.string().min(3).required(),
    rePassword: joi.ref("password"),
    isAdmin: joi.boolean()
});

route.get('/', userProtect.isNotAuth, (req, res) => {
    res.render('signup', {
        title: 'Signup',
        isUser: false,
        isAdmin: false,
        validationError: req.flash('validationError')[0]
    })
})

route.post('/', userProtect.isNotAuth, urlEncode, (req, res) => {
    const result = schema.validate(req.body),
        jsonResponse = new Object();
    // console.log(req.body)

    if (result.error) {
        // req.flash('validationError', result.error.details[0].message)
        // res.redirect('/signup')
        // console.log("error occur"+result.error)
        jsonResponse.err = result.error.details[0].message
        res.json(jsonResponse)
    } else {
        users.find({email:req.body.email})
        .then((doc)=>{
            if(doc.length > 0){
                jsonResponse.err = "Email is already exist"
                res.json(jsonResponse)
            }else{
                const user = new users({
                    userName: req.body.userName,
                    email: req.body.email,
                    password: req.body.password,
                    isAdmin: req.body.isAdmin
                });
                bcrypt.hash(user.password, 10)
                    .then((passHash) => {
                        user.password = passHash;
                        return user.save()
                    })
                    .then(() => {
                        //    req.flash('userAdded','user added successfully');
                        //    res.redirect('/login');
                        jsonResponse.redirect_url = "/login"
                        jsonResponse.message = 'user added successfully';
                        res.json(jsonResponse)
                    })
                    .catch((err) => {
                        jsonResponse.err = err;
                        res.json(jsonResponse);
                    })
            }
        })
        
    }

})
module.exports = route