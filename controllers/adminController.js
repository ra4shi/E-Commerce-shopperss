
const User = require('../models/userModel')
const bcrypt = require('bcrypt')
const Category = require('../models/categoryModel')
const {log} = require('console')
const Product = require('../models/productModel')
const cartModel = require('../models/cartModel')
const coupon = require('../models/couponModel')
const Order = require('../models/orderModel')







const securePassword = async (req,res)=>{

    try {

        const passwordHash = await bcrypt.hash(password , 10)

        return passwordHash;
        
    } catch (error) {
        console.log(error.message);
    }
}

const loadLogin = async (req,res)=>{

    try {

    res.render('login')
        
    } catch (error) {
        console.log(error.message);
    }
}

const verifyLogin = async (req, res) => {
    try {

        const email = req.body.email;
        const password = req.body.password;


        const userData = await User.findOne({ email: email })
        if (userData) {

            const passwordMatch = await bcrypt.compare(password, userData.password)

            if (passwordMatch) {

                if (userData.is_admin === 0) {
                    res.render('login', { message: "Email and password is incorrect" });
                } else {
                    req.session.user_id = userData.id;
                    res.redirect("/admin/home")
                }

            } else {
                res.render('login', { message: "Email and password is incorrect" });
            }



        } else {
            res.render('login', { message: "Email and password is incorrect" });
        }

    } catch (error) {
        console.log(error.message);
    }
}


const logout = async (req, res) => {
    try {
        req.session.destroy()
        res.redirect('/admin');
    } catch (error) {
        console.log(error.message)
    }
}
const adminDashbord = async (req, res) => {
    try {

        const today = new Date();
        const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const endOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

        const orderstoday = await Order.find({ date: { $gte: startOfToday, $lt: endOfToday } }).count();
        
        const coupons = await coupon.find({}).count()
        const userblock = await User.find({is_block:1}).count()
        const user = await User.find({is_block:0}).count()
        const category= await Category.find().count()
        const product = await Product.find().count()
        const ordertotal = await Order.find({status:{$ne:"Cancelled"}}).count()
        const accounttotal = await Order.aggregate([
            {
              $match: {
                status: {
                  $ne: 'Cancelled'
                }
              }
            },
            {
              $group: {
                _id: null,
                totalamount: {
                  $sum: "$Amount"
                }
              }
            }
          ])
          
        const cod = await Order.find({paymentMethod:'COD'}).count()
        const online = await Order.find({paymentMethod:'onlinePayment'}).count()

        const date = new Date()
        const year = date.getFullYear()
        const currentYear = new Date(year, 0, 1)

        const salesByYear = await Order.aggregate([
            {
                $match: {
                    date: { $gte: currentYear }, status: { $ne: 'Cancelled' }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%m", date: "$date" } },
                    total: { $sum: "$Amount" },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ])


        let sales = []
        for (i = 1; i < 13; i++) {
            let result = true
            for (j = 0; j < salesByYear.length; j++) {
                result = false
                if (salesByYear[j]._id == i) {
                    sales.push(salesByYear[j])
                    break;
                } else {
                    result = true

                }
            }
            if (result) {
                sales.push({ _id: i, total: 0, count: 0 })
            }

        }

        let yearChart = []
        for (i = 0; i < sales.length; i++) {
            yearChart.push(sales[i].total)
        }

        
        res.render('home', {userblock,user,category,product,ordertotal , accounttotal,cod ,online,orderstoday, yearChart,coupons});
    } catch (error) {
        console.log(error.message)
    }
}



//load user managemnt with user data

const loadUserManagement = async (req, res) => {
    try {
        const usersData = await User.find({ is_admin: 0 })
        res.render('user', { users: usersData });

    } catch (error) {
        console.log(error.message)

    }
}

//to block

const blockUser = async (req, res) => {
    try {
        const id = req.query.id;
         await User.findByIdAndUpdate({ _id:id }, { $set: { is_block: 1 } })
        res.redirect("/admin/user")
    } catch (error) {
        console.log(error.message);
    }
}

//to unblock

const unBlockUser = async (req, res) => {
    try {
        const id = req.query.id;
         await User.findByIdAndUpdate({ _id:id }, { $set: { is_block: 0 } })
        res.redirect("/admin/user")
    } catch (error) {
        console.log(error.message);
    }
}







            






module.exports = {
    verifyLogin,
    loadLogin,
    securePassword,
    logout,
    adminDashbord,
    loadUserManagement,
    blockUser,
    unBlockUser,
  
   

   

}