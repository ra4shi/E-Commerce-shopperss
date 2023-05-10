const express= require("express");
const admin_route = express();
const Order = require('../models/orderModel')
const bodyParser = require("body-parser")
const adminController = require('../controllers/adminController')
const couponController = require('../controllers/couponController')
const categoryController =  require('../controllers/categoryController')
const cartController = require('../controllers/cartController')
const productController = require('../controllers/productController')
const bannerController = require('../controllers/bannerController')
const orderController = require('../controllers/orderController');
const dotenv = require('dotenv')
dotenv.config();

const path = require("path");
const session = require("express-session")

const config = require("../config/config")

admin_route.use(session({
    secret:config.sessionSecret,
    saveUninitialized:true,
    resave:false,
    Cookie:{maxAge : 120000},
}))

const multer = require('multer')

const storage = multer.diskStorage({
    destination:function(req,file,cb) {
        cb(null,path.join(__dirname,'../public/admin/img'))
    },
    filename:function(req,file,cb){
        const name = Date.now()+'-'+file.originalname 
        cb(null,name)
    }
})
const upload = multer({storage:storage})



const adminauth = require('../middleware/adminauth');
const { use } = require("express/lib/router");

admin_route.set('view engine','ejs')

admin_route.set('views','./views/admin')


admin_route.get('/', adminauth.isLogout, adminController.loadLogin,)

admin_route.post('/', adminController.verifyLogin)

admin_route.get('/home', adminauth.isLogin, adminController.adminDashbord)

admin_route.get('/logout', adminauth.isLogin, adminController.logout);

admin_route.get('/user',adminauth.isLogin,adminController.loadUserManagement);

admin_route.get('/block',adminauth.isLogin,adminController.blockUser);

admin_route.get('/unblock',adminauth.isLogin,adminController.unBlockUser);

admin_route.get('/category',adminauth.isLogin,categoryController.loadCategory);

admin_route.get('/addcategory',adminauth.isLogin,categoryController.loadAddcategory)

admin_route.get('/deletecategory',adminauth.isLogin,categoryController.deletecategory)

admin_route.get('/editcategory',adminauth.isLogin,categoryController.editcategory)

admin_route.post('/addcategory',categoryController.addcategory)

admin_route.post('/category',categoryController.editcategory)

admin_route.get('/products',adminauth.isLogin,productController.loadProducts)

admin_route.get('/addProducts',adminauth.isLogin,productController.loadaddProduct);

admin_route.get('/editProduct',adminauth.isLogin,productController.loadeditProduct);

admin_route.get('/deleteProduct',adminauth.isLogin,productController.deleteProduct);

admin_route.post('/addProducts',upload.array('image',3),productController.insertProduct);

admin_route.post('/editProduct',upload.array('image',3),productController.addeditProduct);





admin_route.get('/addCoupon',adminauth.isLogin,couponController.loadAddCoupon);
admin_route.get('/listCoupon',adminauth.isLogin,couponController.listCoupon);
admin_route.get('/editCoupon',adminauth.isLogin,couponController.loadEditProduct);
admin_route.get('/deleteCoupon',adminauth.isLogin,couponController.deleteCoupon);
admin_route.post('/addCoupon',couponController.postAddCoupon);
admin_route.post('/editCoupon',couponController.postEditCoupon);



admin_route.get("/addbanner",adminauth.isLogin,bannerController.addbanner)
admin_route.post("/addbanner",adminauth.isLogin,upload.single("bannerimage"),bannerController.postaddbanner)
admin_route.get("/viewbanner",adminauth.isLogin,bannerController.viewbanner)
admin_route.post("/updatebanner",adminauth.isLogin,bannerController.bannerstatus)
admin_route.get("/editbanner/:id",adminauth.isLogin,bannerController.editbanner)
admin_route.post("/editbanner/:id",adminauth.isLogin,upload.single("bannerimage"),bannerController.posteditbanner)



admin_route.get('/orders',adminauth.isLogin,orderController.adminShowOrder);
admin_route.get('/editOrder',adminauth.isLogin,orderController.editOrder);
admin_route.get('/viewProduct',adminauth.isLogin,orderController.viewProduct);
admin_route.get('/exportOrder',adminauth.isLogin,orderController.exportOrder);
admin_route.get('/sales',orderController.sales)
admin_route.get('/exportOrderPDF',orderController.exportOrderPDF);

admin_route.post('/editOrder',orderController.postEditOrder);

admin_route.get('/admin/filterOrders', function(req, res) {
    var filterDate = req.query.date;
    
   
    Order.find({ date: filterDate }, function(err, orders) {
      if (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
      } else {
        res.json(orders);
      }
    });
  
   
  });

admin_route.get('*', (req, res) => {
    res.redirect('/admin');
})
module.exports = admin_route
