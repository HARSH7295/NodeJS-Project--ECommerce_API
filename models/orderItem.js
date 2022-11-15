const mongoose = require('mongoose');

const orderItemSchema = mongoose.Schema({
  product: {
    type: mongoose.Schema.ObjectId,
    ref: 'Product',
    required: true,
  },
});

module.exports = orderItemSchema