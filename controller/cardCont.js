
const CARDS = require('../models/cardModel');
const ORDERS = require('../models/orderModel');
const validationResult = require('express-validator').validationResult

let getCard = (req, res) => {
    CARDS.find({ userId: req.session.userId }).populate({
        path: 'productId',
        model: 'product'
    })
        .then((doc) => {
            // console.log(doc)
            res.render('card', {
                title: 'Card',
                isUser: true,
                isAdmin: req.session.isAdmin,
                card: doc,
                cardSaved: req.flash('cardSaved')[0],
                vError: req.flash('vError')[0],
                deleteCard: req.flash('deleteCard')[0],
                cardItems: doc.length
            })
        })
}

let addToCard = (req, res) => {
    const jsonResponse = {}
    const card = new CARDS({
        userId: req.session.userId,
        productId: req.body.productId,
        quantity: req.body.quantity,

    });
    CARDS.findOneAndUpdate({
        $and: [
            { userId: card.userId },
            { productId: card.productId }
        ]
    },
        { quantity: req.body.quantity, time: Date.now() },
        { upsert: true, new: true, setDefaultsOnInsert: true })
        .then(() => {
            // req.flash("cardSaved", "added to card success");
            // res.redirect('/card')
            CARDS.countDocuments({userId: req.session.userId},(err, count)=>{
                console.log(count)
                jsonResponse.count = count
                jsonResponse.message = "added to card success"
                console.log("success")
                res.json(jsonResponse)
            })
            
        }).catch((err) => {
            // req.flash("vError", err);
            // res.redirect('/card')
            jsonResponse.err = err
            console.log("fuild")
            res.json(jsonResponse)
        })

}

let deleteFromCard = (req, res) => {
    CARDS.deleteOne({ _id: req.body.cardId }).then(() => {
        req.flash('deleteCard', 'deleted successfully');
        res.redirect('/card');
    })
};

let PostOrder = (req, res) => {
    // define json object for send response as json
    let jsonResponse = new Object()

    let errors = validationResult(req);
    if (!errors.isEmpty()) {
        jsonResponse.err = errors.array()[0]
        res.json(jsonResponse)
    } else {
        let userId = req.session.userId
        let order = new ORDERS();
        order.userId = userId
        order.address = req.body.address;
        order.products = req.body.products;
        order.phones = req.body.phones;
        order.status = req.body.status;
        order.name = req.body.name;
        order.orderDate = req.body.orderDate;
        
        console.log(order)
        order.save()
            .then(() => {
                return CARDS.deleteMany({ userId: userId })

            }).then(() => {
                jsonResponse.redirect_url = "/orders"
                jsonResponse.message = "order completed "
                res.json(jsonResponse)
            })
            .catch((err) => {
                console.log(err)
                jsonResponse.err = err
                res.json(jsonResponse)
            })

        /* CARDS.deleteMany({ userId: userId }).then(() => {
            order.save()
                .then(() => {
                    jsonResponse.redirect_url = "/products"
                    jsonResponse.message = "order completed "
                    res.json(jsonResponse)
                })
                .catch((err) => {
                    console.log(err)
                    jsonResponse.err = err
                    res.json(jsonResponse)
                })
        }) */

    }

};

module.exports = {
    getCard, addToCard, deleteFromCard, PostOrder
}