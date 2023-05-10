const mongoose = require('mongoose');

const CategorySchema= new mongoose.Schema({

Category:{
    type:String,
    required:true
},

is_block:{
    type:Boolean,
    required:true
}

})

const Category = mongoose.model("Category",CategorySchema);

module.exports = Category;