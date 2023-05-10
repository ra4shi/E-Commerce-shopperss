const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  user: {
    type: String,
    required: true
  },
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      productPrice: {
        type: Number,
        required: true
      },
      count: {
        type: Number,
        default: 1
      }
    }
  ]
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
