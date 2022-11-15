const mongoose = require('mongoose');

const orderItemSchema = require('../models/orderItem')

const OrderSchema = mongoose.Schema(
  {
    tax: {
      type: Number,
      required: true,
    },
    shippingFee: {
      type: Number,
      required: true,
    },
    subtotal: {
      type: Number,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    orderItems: [orderItemSchema],
    status: {
      type: String,
      enum: ['pending', 'failed', 'paid', 'delivered', 'canceled'],
      default: 'pending',
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
   /* clientSecret: {
      type: String,
      required: true,
    },
    paymentIntentId: {
      type: String,
    },*/
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', OrderSchema);
