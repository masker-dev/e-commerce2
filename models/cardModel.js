const mongoose = require ("mongoose");

const schema = mongoose.Schema({
    userId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    productId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product',
        required: true
    },
    quantity : {type: Number, required: true },
    time: Number
});

const cards = mongoose.model('card', schema);
module.exports = cards;

/* module.exports = function Card(oldCard){
    this.items = oldCard.items || {};
    this.totalQty = oldCard.totalQty || 0;
    this.totalPrice = oldCard.totalPrice || 0;

    this.addItems = function(item, id){
        let storedItems = this.items[id];
        if (!storedItems){
            storedItems = id
        }
    }
} */