const User = require("../models/userModel")
const Product =require('../models/productModel')
const bcrypt = require('bcrypt');
const nodemailer = require("nodemailer")
const Cart = require('../models/cartModel')
const config = require('../config/config')
const Category = require('../models/categoryModel')
const coupon = require('../models/couponModel')
const Banner = require('../models/bannerModel')
const wishlist = require('../models/wishlistModel')
const Address = require('../models/addressModel')
const banner = require("../models/bannerModel")


let otp2;

let varemail;



const randomstring = require("randomstring");
const { name } = require("ejs");


const securePassword = async(password)=>{
    try {

      const passwordHash =  await  bcrypt.hash(password,10);

      return passwordHash;
        
    } catch (error) {
        console.log(error.message);
    }
}

// for send mail
const sendVerifyMail = async (name,email,user_id,otp)=>{

    try {

        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port:587,
            secure:false,
            requireTLS:true,
            auth:{
                user:config.emailUser,
                pass:config.emailPassword
                
            }
        });
        const mailOptions = {
            from:config.emailUser,
            to:email,
            subject:' For Verification Mail',
            html:'<p>Hii '+name+' , Please Click Here To  <a href="http://127.0.0.1:3000/verify?id='+otp+'"> varify</a> and enter the'+otp+' for your verification '+email+ '</p>', 
        }
        transporter.sendMail(mailOptions, function (error,info) {
            if(error){
                console.log(error);
            }
            else {
                console.log("Email Has Been Send :- ",info.response);
            }
        })
        
    } catch (error) {
        console.log(error.message);
    }
}

// for reset password

const sendResetPasswordMail = async (name,email,token)=>{

    try {

        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port:587,
            secure:false,
            requireTLS:true,
            auth:{
                user:config.emailUser,
                pass:config.emailPassword
                
            }
        });
        const mailOptions = {
            from:config.emailUser,
            to: email,
            subject:' For Reset Password',
            html:'<p>Hii '+name+' , Please Click Here To  <a href="http://127.0.0.1:3000/forget-password?token='+token+'"> Reset </a> your Password..</p>'
        }
        transporter.sendMail(mailOptions, function (error,info) {
            if(error){
                console.log(error);
            }
            else {
                console.log("Email Has Been Send :- ",info.response);
            }
        })
        
    } catch (error) {
        console.log(error.message);
    }
}


const loadRegister = async(req,res)=>{
    try {
        
        res.render('register')

    } catch (error) {
        console.log(error.message);
    }
}



const insertUser = async(req,res)=>{

    try {
        
        const email = req.body.email
        const already = await User.findOne({email:email})
        varemail = email
        const cpassword = req.body.confirmpassword
        const spassword = await securePassword(req.body.password)
        const user = new User({
            name:req.body.name,
            email:req.body.email,
            mobile:req.body.mobile,
            password:spassword,
            is_admin:0,
            
            
        })

        const userData = await user.save();
        
        if(userData){

            const otpgenerator = Math.floor(1000+Math.random()*9999)
            otp2 = otpgenerator

            sendVerifyMail(req.body.name, req.body.email , userData._id,otpgenerator);

            res.redirect('/verify')
        } 
        else {
            res.render('register',{message:'Registration Has Been Failed..'})
        }

    } catch (error) {
        console.log(error.message);
    }
}

const verifyMail = async (req,res)=>{

    try {




      res.render("verify");

        
    } catch (error) {
        
        console.log(error.message);
    }
}

const checkotp = async (req,res)=>{

    try {

        if(otp2 == req.body.otp){
           
            const updateInfo = await User.updateOne({email:varemail},{$set:{is_verified:1}})
            res.render('login')
        }
        else{
            res.render('register')
        }
        
    } catch (error) {
        console.log(error.message);
    }
}

//login user methods

const loginLoad = async (req,res)=>{
    try {
        
        res.render('login')

    } catch (error) {
        console.log(error.message);
    }
}

const verfyLogin = async ( req,res)=>{

    try {
        const email = req.body.email;
        const password = req.body.password;

      const userData = await  User.findOne({email:email});

      if(userData){

       const passwordMatch = await bcrypt.compare(password,userData.password);

       if (passwordMatch){
        
        if(userData.is_block===0){

        if(userData.is_verified === 0){


            res.render('login',{message:"Please verify your mail.."})
        }
        } else {

            req.session.user_id = userData._id;
            req.session.hid='page-1-link'
            req.session.limit= 4

            res.redirect('/home')
        }
       }
       else {
        res.render('login',{message:'Email and Password is incorrect'})
       }
      }
      else {
        res.render('login',{message:'Email and Password is incorrect'})
      }
        
    } catch (error) {
        console.log(error.message);
    }
}


const loadHome = async (req,res)=>{
    

    try {
        let banners = await banner.find()
       const data = await Product.find()

        res.render('home',{banners,dataa:data})
        
    } catch (error) {
        console.log(error.message);
    }

}


const userLogout = async(req,res)=>{
    try {

        req.session.destroy();
        res.redirect('/');
        
    } catch (error) {
        console.log(error.message);
    }
}
// forget password 


const forgetLoad =  async (req,res)=>{

    try {
        
        res.render('forget');
    } catch (error) {
        console.log(error.message);
    }
}

const forgetVerify = async (req,res)=>{

    try {

        const email = req.body.email;
        const userData = await User.findOne({email:email})

        if(userData){
            
            if(userData.is_verified === 0){
                res.render('forget',{ message:"PLEASE VERIFY YOUR EMAIL FIRST"})
            }
            else {
                const randomString = randomstring.generate();

                const updatedData = await User.updateOne({email:email},{$set:{token:randomString}})
                console.log(updatedData);
                sendResetPasswordMail(userData.name,userData.email,randomString)
                
                res.render('forget',{ message:"PLEASE CHECK YOUR MAIL TO RESET YOUR PASSWORD..."})
                
            }

        }
        else {
            res.render('forget',{message:"USER EMAIL IS INCORRECT.."})
          
        }
        
    } catch (error) {
        console.log(error.message);
    }
}

const forgetPassworLoad = async (req,res)=>{

    try {

        const token = req.query.token;
        const tokenData = await User.findOne({token:token})
        if (tokenData) {
            

            res.render('forget-password',{user_id:tokenData._id})

        }
        else {

            res.render('404',{message:"Token is invalid"})
        }
        
    } catch (error) {
        console.log(error.message);
    }
}

const resetPassword = async(req,res)=>{

    try {
        
        const password = req.body.password;
        const user_id = req.body.user_id;

        const secure_password = await securePassword(password);
        

        const updatedData = await User.findByIdAndUpdate({ _id:user_id} , {$set:{password:secure_password, token:""}})

        res.redirect('/')
    } catch (error) {

        console.log(error.message);

    }
}


const shop=async (req,res)=>{

    try {
        
        
        
        const value1 = parseInt(req.session.value1)
        const value2 = parseInt(req.session.value2)

        if (req.session.category) {
           
            if (req.session.sort && req.session.value1 && req.session.value2) {

                const data = await Product.find({ Category: req.session.category, price: { $gte: value1, $lte: value2 } }).sort({ price: req.session.sort }).skip(req.session.stx).limit(req.session.limit)
                const total = await Product.find({ Category: req.session.category, price: { $gte: value1, $lte: value2 } })
                const size= Math.ceil(total.length/req.session.limit)
                res.render('shop', { dataa: data ,tagId:req.session.hid,size}) 
                req.session.sort = null
                req.session.value1 = null
                req.session.value2 = null
                req.session.category = null
                req.session.limit= null
                req.session.page= null


            }
            else if (req.session.sort == null && req.session.value1 && req.session.value2) {
                

                const data = await Product.find({ Category: req.session.category, price: { $gte: value1, $lte: value2 } }).skip(req.session.stx).limit(req.session.limit)
                const total = await Product.find({ Category: req.session.category, price: { $gte: value1, $lte: value2 } })

                const size= Math.ceil(total.length/req.session.limit)

                res.render('shop', { dataa: data ,tagId:req.session.hid,size})
                req.session.value1 = null
                req.session.value2 = null
                req.session.category = null
                req.session.limit= null
                req.session.page= null

            }
            else if (req.session.sort && req.session.value1 == null && req.session.value2 == null) {
                
                const data = await Product.find({ Category: req.session.category }).sort({ price: req.session.sort }).skip(req.session.stx).limit(req.session.limit)
                const total = await Product.find({ Category: req.session.category })
                const size= Math.ceil(total.length/req.session.limit)
                res.render('shop', { dataa: data,tagId:req.session.hid,size })

                req.session.sort = null
                req.session.category = null
                req.session.limit= null
                req.session.page= null



            }
            else if (req.session.sort == null && req.session.value1 == null && req.session.value2 == null) {
                
               
                const data = await Product.find({ Category: req.session.category }).skip(req.session.stx).limit(req.session.limit)
                const total = await Product.find({ Category: req.session.category })
                const size= Math.ceil(total.length/req.session.limit)
                res.render('shop', { dataa: data,tagId:req.session.hid,size })
                req.session.category = null
                req.session.limit= null
                req.session.page= null


            }
        } else {
            if (req.session.sort && req.session.value1 && req.session.value2) {
               
                const data = await Product.find({ price: { $gte: value1, $lte: value2 } }).sort({ price: req.session.sort }).skip(req.session.stx).limit(req.session.limit)
                const total = await Product.find({ price: { $gte: value1, $lte: value2 } })
                const size= Math.ceil(total.length/req.session.limit)
                res.render('shop', { dataa: data,tagId:req.session.hid,size })
                req.session.sort = null
                req.session.value1 = null
                req.session.value2 = null
                req.session.limit= null
                req.session.page= null

            }
            else if (req.session.sort == null && req.session.value1 && req.session.value2) {
               
                console.log(req.session.value2);
                console.log(req.session.value1);

                const data = await Product.find({ price: { $gte: value1, $lte: value2 } }).skip(req.session.stx).limit(req.session.limit)
                const total = await Product.find({ price: { $gte: value1, $lte: value2 } })
                const size= Math.ceil(total.length/req.session.limit)
                res.render('shop', { dataa: data,tagId:req.session.hid,size })

                req.session.value1 = null
                req.session.value2 = null
                req.session.limit= null
                req.session.page= null


            }
            else if (req.session.sort && req.session.value1 == null && req.session.value2 == null) {
                
                const data = await Product.find().sort({ price: req.session.sort }).skip(req.session.stx).limit(req.session.limit)
                const total = await Product.find()
                const size= Math.ceil(total.length/req.session.limit)
                res.render('shop', { dataa: data,tagId:req.session.hid,size})
                req.session.sort = null

                req.session.limit= null
                req.session.page= null



            }
            else if (req.session.sort == null && req.session.value1 == null && req.session.value2 == null) {
               
                const data = await Product.find().skip(req.session.stx).limit(req.session.limit)
                const total = await Product.find()
                const size= Math.ceil(total.length/req.session.limit)
                
                res.render('shop', { dataa: data,tagId:req.session.hid,size })
                req.session.limit= null
                req.session.page= null


            }
        }
    } catch (error) {
        console.log(error.message);
    }
}


const category = async (req, res) => {


    req.session.category = req.query.category
    res.redirect('/shop')
}


const sort = async (req, res) => {


    req.session.sort = req.query.sort
    res.redirect('/shop')
}


const filter = async (req, res) => {


    req.session.value1 = req.query.value1
    req.session.value2 = req.query.value2
    

    res.redirect('/shop')
}



const pagination = async(req,res)=>{
    try {
       const page = req.query.page
       const id = req.query.id
       
       req.session.hid=id
       req.session.stx= (page-1)*req.session.limit
       res.redirect('/shop')

    } catch (error) {
        console.log(error.message);
    }
  }



// single page

const singlepage = async (req,res)=>{
    try {
        const id=req.query.id;
        
      const productdata =  await Product.findOne({_id:id})
      
     
        res.render('shop-single',{productdata})
      

    } catch (error) {
        
    }
}






const checkoutee = async (req, res) => {

    try {

        const cartdata = await Cart.findOne({ userId: req.session.user_id })
      
        // const data = await address.findOne({ userId: req.session.user_id })
        const couponcode = await coupon.find()
        const total = req.session.total

        
            res.render('checkout', { cartdata, total, couponcode })
    

    } catch (error) {
        console.log(error.message)
    }

}


const loadProfile = async (req,res)=>{
    try{
        const userName = await User.findOne({_id:req.session.user_id});
        const addressData = await Address.findOne({userId:req.session.user_id});
        const [address] = addressData.addresses;
        if(req.session.user_id){
            const customer = true;
            res.render('profile',{customer,userName,address});
        }else{
            res.redirect('/');
        }
    }catch(error){
        console.log(error.message);
    }
}

const searchproduct =async (req,res)=>{
    try {
 
     const searchValue =req.body.search
     console.log(req.body.search);
     console.log(searchValue);
     const search =searchValue.trim()
 
     if(search!=''){
         const data =await Product.find({$and:[{name:{$regex: `^${search}`,$options:'i'}}]});
         const total = await Product.find()
         const size= Math.ceil(total.length/req.session.limit)
         
             res.render('shop',{dataa: data,tagId:req.session.hid,size})
     }  
   }
     catch (error) {
 
     console.log(error.message);
     
    }
   
 
 }


module.exports = {

    loadRegister,
    insertUser,
    verifyMail,
    loginLoad,
    verfyLogin,
    loadHome,
    userLogout,
    forgetLoad,
    forgetVerify,
    forgetPassworLoad,
    resetPassword,
    checkotp,
   
    shop,
    singlepage,
    loadProfile,

    checkoutee,
    category,
    filter,
    sort,
    pagination,
    searchproduct
    
}