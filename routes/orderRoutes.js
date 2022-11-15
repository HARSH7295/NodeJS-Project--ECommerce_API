
const express = require('express')
const authentication = require('../middleware/authentication')
const authorization = require('../middleware/authorization')
const router = express.Router()
const {createOrder,getAllOrders,getCurrentUserOrders,updateOrder,getSingleOrder} = require('../controllers/orderController')

router.route('/createOrder').post(authentication,createOrder)
router.route('/getAllOrders').get(authentication,authorization('admin'),getAllOrders)
router.route('/showMyAllOrders').get(authentication,getCurrentUserOrders)
router.route('/:id').get(authentication,getSingleOrder)
router.route('/update/:id').patch(authentication,updateOrder)

module.exports = router