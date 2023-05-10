const mongoose = require('mongoose')

const ProductSchema = mongoose.Schema({

    name:{
        type: String,
        required: true
    },
    price:{
        type: Number,
        required: true
    },
    Category:{
        type: String, 
        required: true
    },
    stock:{
        type: Number, 
        required: true
    },
    size:{
        type: String,
        required:false
    },
    image:{
        type: [String], 
        required: true
    },
    description:{
        type: String,
        required: true
    },
    item:{
        type: String,
        required: true
    },
    color:{
        type: String,
        required: true
    },
    is_block:{
        type: Boolean, 
        default: false 
    }

})

const Product = mongoose.model("Product",ProductSchema)

module.exports = Product
