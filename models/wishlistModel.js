
const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');
const wishlistSchema = new mongoose.Schema({
    user:{
        type:String,
        required:true
    },
    userName:{
        type:String,
        required:true
    },
    products:[{
        productId:{
            type:ObjectId,
            ref:"Product",
            required:true
        }
    }]
})

const wishlistModel = mongoose.model("wishlist",wishlistSchema);
module.exports = wishlistModel; 