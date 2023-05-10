const mongoose = require('mongoose');

const userSchema=mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    mobile:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    
    is_admin:{
        type:Number,
        required:true
    },
    is_verified:{
        type:Number,
        default:0
    },
    token:{
        type:String,
        default:""
    },
    is_block:{
        type:String,
        default:0
    },
    wallet :{
        type : Number,
        default : 0
    }
});

const User = mongoose.model("User",userSchema);

module.exports = User;