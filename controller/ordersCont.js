const ORDERS = require('../models/orderModel');
const CARDS = require('../models/cardModel')

let getOrders =(req, res)=>{
    ORDERS.find({userId: req.session.userId, status:{"$ne": "completion"}})
    .populate({
        path:'products.productId',
        model:'product'
    })
    .then((orders)=>{

        orders.forEach((order)=>{
            let superTotal = 0;

            order.products.forEach((product)=>{
              let total = product.quantity * product.price;
              product.total = total
              superTotal += total
            })

            order.superTotal = superTotal;
            let date = new Date(order.orderDate)
            date = `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,0)}-${date.getDate()}`
            order.newDate = date
            order.orderDate = null
            delete order.orderDate
            order.orderDate = date
            // console.log(order)
        })
        CARDS.countDocuments({userId: req.session.userId},(err, count)=>{
            res.render('orders',{
                title: 'orders',
                isUser: req.session.userId,
                isAdmin: req.session.isAdmin,
                orders: orders,
                cardItems: count
            })
        })
        
    }).catch((err)=>{
        res.send(err)
    })
    
}

let getOrderDetails = (req, res)=>{
    ORDERS.find({_id: req.params.id})
    .populate({
        path:'products.productId',
        model:'product'
    })
    .then((order)=>{
        
        let superTotal = 0;
        order[0].products.forEach(product=>{
            let total = product.price * product.quantity
            product.total = total
            superTotal += total

        })
        order[0].superTotal = superTotal;
        let date = new Date(order[0].orderDate)
            date = `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,0)}-${date.getDate()}`
            order[0].newDate = date
            CARDS.countDocuments({userId: req.session.userId},(err, count)=>{
                res.render('orderDetail',{
                    title: 'Order Details',
                    isUser: req.session.userId,
                    isAdmin: req.session.isAdmin,
                    order: order[0],
                    cardItems: count
                })

            })

    })
    .catch(err=>res.send(err))
}

let test = (req, res)=>{
    ORDERS.find()
    .populate({
        path:'products.productId',
        model:'product'
    })
    .then((doc)=>{
        res.send(doc)
    }).catch((err)=>res.send(err))
}

module.exports = {
    getOrders, test, getOrderDetails
}