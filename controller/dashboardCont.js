const PRODUCTS = require('../models/productModel');
const USERS = require ('../models/userModel');
const ORDERS = require ('../models/orderModel');
const CARDS = require('../models/cardModel');
const mkdirp = require('mkdirp');
const fs = require('fs-extra');
const vResult = require('express-validator').validationResult;



let getDashboard = (req, res)=>{
    PRODUCTS.find()
    .then((doc)=>{
        USERS.find()
        .then((users)=>{
            ORDERS.find()
            .then((orders)=>{
                CARDS.countDocuments({userId: req.session.userId},(err, count)=>{
                    res.render('admin/dashboard',{
                        title: "Dashboard",
                        isUser: true, 
                        isAdmin: true,
                        products: doc,
                        prodLength: doc.length,
                        users : users.length,
                        orders: orders.length,
                        cardItems: count
                    })
                })
            })
        })
        
    })
};

let getAddProduct = (req, res) => {
    CARDS.count({userId: req.session.userId},(err, count)=>{
        res.render('admin/addProduct', {
            title: 'Add Product',
            userId: req.session.userId,
            isUser: true,
            isAdmin: true,
            validationError: req.flash('validationError')[0],
            failed: req.flash('failed')[0],
            success: req.flash('success')[0],
            duplicate: req.flash('duplicate')[0],
            cardItems: count
        })
    })
    
};

let postProduct = (req, res) => {

    if (!vResult(req).isEmpty()) {
        console.log(vResult(req).array())
        req.flash('validationError', vResult(req).array())
        res.redirect('/admin/addProduct')
    } else {
        // req.files is like req.body , we use it because we can not use req.body to read files
        let pictureObj = req.files.picture
        PRODUCTS.findOne({ name: req.body.name })
            .then((data) => {
                if (data) {
                    req.flash('duplicate', "product was exist")
                    res.redirect('/admin/addProduct')
                } else {
                    const product = new PRODUCTS({
                        name: req.body.name,
                        type: req.body.type,
                        description: req.body.description,
                        price: req.body.price,
                        quantity: req.body.quantity,
                        userId: req.body.userId,
                        picture: pictureObj.name
                    })
                    product.save()
                        .then((data) => {
                            mkdirp('DBimages/productImages/' + data._id)
                            .then(()=>{
                                console.log("mkdirp success")
                                let path = 'DBimages/productImages/' + data._id + '/' + pictureObj.name;
                                return pictureObj.mv(path)
                            }).then(()=>{
                                req.flash('success', 'Product added success');
                                res.redirect('/admin/addProduct')
                            })
                            .catch(err=>{
                                console.log(`Error at product id directory ${err}`)
                            });
                            

                            // mkdirp('DBimages/productImages/' + data._id + '/gallery')
                            // .catch(err=> console.log(err));

                            
                            // mkdirp('DBimages/productImages/' + data._id + '/gallery/thumbs')
                            // .catch(err=> console.log(err));


                            // let path = 'DBimages/productImages/' + data._id + '/' + pictureObj.name;
                            // pictureObj.mv(path).catch(err=>console.log(err));

                            // req.flash('success', 'Product added success');
                            // res.redirect('/admin/addProduct')
                        })
                        .catch((err) => {
                            req.flash('failed', 'product not added : '+ err);
                            console.log(err);
                            res.redirect('/admin/addProduct');
                        })
                }
            })
    }
};

let getEditProduct = (req, res) => {

    PRODUCTS.findById(req.params.id)
        .then((data) => {
            CARDS.countDocuments({userId: req.session.userId},(err,count)=>{
                res.render('admin/editProduct', {
                    title: 'admin-Edit Product',
                    product: data,
                    isAdmin: true,
                    userId: true,
                    isUser: true,
                    success: null,
                    failed: null,
                    duplicate: req.flash('duplicate')[0],
                    validationError: req.flash('validationError')[0],
                    productId: req.params._id,
                    oldImage: data.picture,
                    cardItems: count
                })
            })
            
        })
        .catch()
};

let postEditProduct = (req, res) => {
    if (!vResult(req).isEmpty()) {
        req.flash('validationError', vResult(req).array());
        res.redirect(`/admin/editProduct/${req.params.id}`)
    } else {
        let id = req.params.id;
        
        function uploadImage(files=""){
            if(files){
                fs.remove(`DBimages/productImages/${id}/${req.body.oldImage}`,function(err){
                    if(err){
                        res.send(err)
                    }
                })
                files.picture.mv('DBimages/productImages/' + id + '/' + files.picture.name)
                .then(()=>{
                    console.log("image uploaded")
                })
                .catch(err=> res.send(err))
                
            }else{
                console.log("can not find anew picture")
            }
        }

        function getImageName(files=""){
            if(files){
                return files.picture.name
            }
            return req.body.oldImage
        }

        PRODUCTS.findByIdAndUpdate(id, {$set:{
            name:req.body.name,
            type: req.body.type,
            description: req.body.description,
            price: req.body.price,
            quantity: req.body.quantity,
            userId: req.session.userId,
            picture: getImageName(req.files)
            
        }})
            .then((data) => {
                uploadImage(req.files)
                res.redirect('/admin')
            }).catch((err) => {
                res.send(err)
            })
    }
};

let deleteProduct = (req, res)=>{
    let path = `DBimages/productImages/${req.params.id}`,
        jsonRes = {}
    
    PRODUCTS.findByIdAndRemove(req.params.id)
    .then(()=> {
        return fs.remove(path)
    }).then(()=>{
        // res.redirect('/admin/products')
        jsonRes.message = "Your file has been deleted."
        
        res.json(jsonRes)
    }).catch(err=> {
        jsonRes.err = err
        
        res.json(jsonRes)
    })
}

module.exports= {
    getDashboard, deleteProduct, getAddProduct, postProduct, getEditProduct, postEditProduct
}