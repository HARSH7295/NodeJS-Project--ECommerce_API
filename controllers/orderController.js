const { StatusCodes } = require("http-status-codes")
const Product = require('../models/product')
const Order = require('../models/order')
const order = require("../models/order")

const getAllOrders = async(req,res)=>{
    const orders = await Order.find({})

    res.status(StatusCodes.OK).json({
        orders : orders
    })
}

const getCurrentUserOrders = async(req,res)=>{
    
    const orders = await Order.find({
        user : req.user.id
    })
    res.status(StatusCodes.OK).json({
        MyOrders : orders,
        count : orders.length
    })
}

const updateOrder = async(req,res)=>{
    const {id : orderId} = req.params
    
    //NOTE -> HERE, UPDATE ORDER MEANS UPDATING THE STATUS FIELD WHEN CHANGED SOME EFFECTIVE TRANSACTION
    
    //NOTE -> AS, HERE, WE ARE CREATING ORDER AFTER TAKING ALL CARTITEMS, SO
    //              NO NEED TO CHANGE ORDER EACH TIME CARTITEM IS ADDED/REMOVED.

    const order = await Order.findOne({
        _id : orderId
    })
    if(!order){
        res.status(StatusCodes.BAD_REQUEST).json({
            errorMsg : `No order with id : ${orderId}`
        })
    }

    //CHECKING THAT THIS REQUEST IS MADE BY THE USER, WHO CREATED ORDER
    if(!(order.user.toString() === req.user.id)){
        res.status(StatusCodes.UNAUTHORIZED).json({
            errorMsg : "You are not authorized to do this updae.!!!"
        })
    }

    order.status = 'paid'
    await order.save()
    res.status(StatusCodes.BAD_REQUEST).json({
        msg : "Success.!!! update order done"
    })


}

const getSingleOrder = async(req,res)=>{
    const { id : orderId } = req.params
    const order = await Order.findOne({
        _id : orderId
    })
    if(!order){
        res.status(StatusCodes.NOT_FOUND).json({
            errorMsg : `No order with id : ${orderId}`
        })
    }

    // checking if this order is created by current user?
    // if yes then showcase else not
    if(!(order.user.toString() === req.user.id)){
        res.status(StatusCodes.UNAUTHORIZED).json({
            errorMsg : 'You are not authorized to access this order'
        })
    }
    res.status(StatusCodes.OK).json({
        order : order
    })
}
const createOrder = async(req,res)=>{

    const { items : cartItems, tax,shippingFee } = req.body
    
    // checking if cart is empty?
    if(!cartItems || cartItems.length < 1){
        res.status(StatusCodes.BAD_REQUEST).json({
            errorMsg : 'No cart items provided.!'
        })
    }
    if(!tax || !shippingFee){
        res.status(StatusCodes.BAD_REQUEST).json({
            errorMsg : 'Please provide Tax and ShippingFees'
        })
    }

    let orderItems = []
    let subtotal = 0

    for(var i=0;i<cartItems.length;i++){
        const prod = await Product.findOne({
            _id : cartItems[i].prodId
        })
        //checking if product id is correct?
        if(!prod){
            res.status(StatusCodes.NOT_FOUND).json({
                errorMsg : `No product with id : ${cartItems[i].prodId}`
            })
        }
        // addiing product item in orderitems list
        // NOTE : AS HERE, "product" WANTS OBJECT ID SO NEED TO EXPLICITLY PROVIDE LIKE BELOW
        orderItems = [...orderItems, {
            product : prod._id
        }]
        // subtotal -> for each item, in subtotal curr. items total will be added
        subtotal += ((cartItems[i].numOfProds)*(prod.price))
    }
    const total = tax + shippingFee + subtotal
    
    const order = await Order.create({
        orderItems,
        total,
        subtotal,
        tax,
        shippingFee,
        user : req.user.id
    })
    res.status(StatusCodes.CREATED).json({
        order : order
    })

}

module.exports = {
    getAllOrders,
    getCurrentUserOrders,
    updateOrder,
    getSingleOrder,
    createOrder
}