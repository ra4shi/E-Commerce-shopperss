const express= require("express");
const user_route = express();
const bodyParser = require("body-parser")
const userController = require('../controllers/userController')
const couponController = require('../controllers/couponController')
const cartController = require('../controllers/cartController')
const categoryController = require('../controllers/categoryController')
const wishlistController = require('../controllers/wishlistController')
const addressController = require('../controllers/addressController');
const orderController = require('../controllers/orderController')
const path = require("path");

const session = require("express-session")

const config = require("../config/config")

user_route.use(session({
    secret:config.sessionSecret,
    saveUninitialized:true,
    resave:false,
    Cookie:{maxAge : 120000},
}))

const auth = require('../middleware/auth');
const { use } = require("express/lib/router");

user_route.set('view engine','ejs')

user_route.set('views','./views/users')

user_route.use(bodyParser.json());

user_route.use(bodyParser.urlencoded({extended:true}))

user_route.get('/register',auth.isLogout,userController.loadRegister)

user_route.post('/register',userController.insertUser)

user_route.get('/',auth.isLogout,userController.loginLoad)

user_route.get('/login',auth.isLogout,userController.loginLoad)

user_route.post('/login',userController.verfyLogin)

user_route.get('/home',auth.isLogin,userController.loadHome)

user_route.get('/logout',userController.userLogout)

user_route.get('/forget',auth.isLogout,userController.forgetLoad)

user_route.post('/forget',userController.forgetVerify)

user_route.get('/forget-password',auth.isLogout,userController.forgetPassworLoad)

user_route.post('/forget-password',userController.resetPassword)

user_route.get('/verify',userController.verifyMail)

user_route.post('/otpverify',userController.checkotp)

user_route.get('/shop',auth.isLogin,userController.shop)

user_route.get('/profile',auth.isLogin,userController.loadProfile);

user_route.get('/cart',cartController.LoadCart)

user_route.post('/cart',cartController.CartData)

user_route.get('/shop-single',auth.isLogin,userController.singlepage)

user_route.post('/product-detail',cartController.addToCart)

user_route.post('/changeCount',cartController.changeCount)

user_route.get('/cartprDlt',cartController.cartprDlt)

user_route.post('/hometoCart',cartController.addToCart)

user_route.get('/checkout',auth.isLogin,cartController.loadCheckout);

user_route.get('/ShowCatagory',categoryController.ShowCatagory)

user_route.post('/applyCoupon',couponController.applyCoupon);

user_route.post('/shop',userController.searchproduct)


user_route.get('/wishlist',auth.isLogin,wishlistController.loadWishlist);



user_route.get('/removeWishlist',auth.isLogin,wishlistController.removeWishlist);

user_route.post('/addToWishlist',wishlistController.addToWishlist);

user_route.post('/addFromWish',wishlistController.addFromWish);


user_route.get('/addAddress',auth.isLogin,addressController.addAddress);

user_route.get('/removeAddress',auth.isLogin,addressController.removeAddress);

user_route.post('/addAddress',addressController.insertAddress);

user_route.get('/addAddress',auth.isLogin,addressController.profileaddAddress);

user_route.get('/removeAddress',auth.isLogin,addressController.profileremoveAddress);

user_route.post('/addAddress',addressController.profileinsertAddress);



user_route.get('/orderSuccess',auth.isLogin,orderController.orderSuccess);

user_route.get('/showOrder',auth.isLogin,orderController.showOrder);

user_route.get('/viewOrderProducts',orderController.viewOrderProducts);

user_route.post('/checkout',orderController.placeOrder);

user_route.post('/verifyPayment',orderController.verifyPayment);

user_route.post('/cancelOrder',orderController.cancelOrder);

user_route.get('/category',userController.category)

user_route.get('/sort',userController.sort)

user_route.get('/filter',userController.filter)

user_route.get('/pagination',userController.pagination)



user_route.get('/about',userController.about)

user_route.get('/contact',userController.contact)


module.exports = user_route;