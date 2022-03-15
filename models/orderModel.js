
const mongoose = require('mongoose');

const schema = mongoose.Schema({
    userId: {
        type : mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    address:{type: String, required: true},
    phones : [
        {type: String, required: true},
    ],
    products:[{
        productId : {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'product',
            required: true
        },
        quantity: {type: Number, required: true},
        price: {type: Number, required: true},
        total: {type: Number, required: true}
    }],
    status: {type: String, required: true},
    name: {type: String, required: true},
    orderDate: {type: Date, required: true},
    // superTotal: {type: Number, required: true}
    
});

let orderModel = mongoose.model('order',schema);
module.exports = orderModel;