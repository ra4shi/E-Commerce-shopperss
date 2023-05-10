const Cart = require('../models/cartModel')
const Product =require('../models/productModel')
const User = require('../models/userModel')
const Address = require('../models/addressModel')


// Usercart


var CPRODUT  
var TOTAL  

var date = new Date();
let day = date.getDate();
let month = date.getMonth() + 1;
let year = date.getFullYear();
let currentDate = `${day}-${month}-${year}`




    const addToCart=async(req,res)=>{
        try {
            const productid=req.body.product_id
            const productData=await Product.findOne({_id:productid})
            const userData=await User.findOne({_id:req.session.user_id})
            if(req.session.user_id){

                const userid=req.session.user_id;
                const cartData=await Cart.findOne({userId:userid})
                if(cartData){
                    const productExist= cartData.products.findIndex((product)=>product.productId==productid)
                    if(productExist != -1){
                        const userData = await User.findById({_id:req.session.user_id})
                       
                        
                        await Cart.updateOne({userId:userid,user:userData.name,"products.productId":productid},{$inc:{"products.$.count":1}})
                        res.json({success:true})
                       
                            
                       
                        
                    }else{
                        await Cart.findOneAndUpdate({userId:req.session.user_id},{$push:{products:{productId:productid,productPrice:productData.price}}})
                       res.json({success:true})
                      
                        
                  
                    }
                }else{
                  const cart= new Cart({
                        userId:userData._id,
                        user:userData.name,
                        products:[{
                            productId:productid,
                            productPrice:productData.price,
                           
                        }]
                        
                    })
                const cartDatas=await cart.save()
                    if(cartDatas){
                         res.json({success:true})
                       
                            
                      
                            
                        
                       
                    }else{
                        res.redirect('/shop')
                    }
                }
            }else{
                res.redirect('/login')
            }
        } catch (error){
            console.log(error.message);
           
        }
    }
    const LoadCart=async(req,res)=>{
        try {
       
           const session=req.session.user_id;
           const userdata=await User.findOne({_id:req.session.user_id})
        
           const cartData=await Cart.findOne({userId:req.session.user_id}).populate('products.productId')
           if(req.session.user_id){
           if(cartData){
            if(cartData.products.length>0){
                const products=cartData.products
                const total=await Cart.aggregate([{$match:{user:userdata.name}},{$unwind:'$products'},{$project:{productPrice:'$products.productPrice',count:'$products.count'}},{$group:{_id:null,total:{$sum:{$multiply:['$productPrice','$count']}}}}])
                
                const Total =total[0].total;
                req.session.total=Total
                const userId=userdata._id
                let customer=true
                const STD=45
              CPRODUT=products
              TOTAL=Total

              

                res.render('cart',{customer,userdata,products,Total,userId,session,userdata,STD})
            }else{
        let customer=true;
        res.render('cartEmpty',{customer,userdata,session,msg:'No product added to cart'})
    }
           }else{
            let customer=true
            res.render('cartEmpty',{customer,userdata,session,msg:'No product added to cart'})
           }
        }else{
            res.redirect('/register')
        }
        } catch (error) {
            console.log(error.message)
        }
    }

    const cartprDlt=async(req,res)=>{
        try {

            
            const Id=req.query.userid
           
            const remove=await Cart.updateOne({userId:Id},{$pull:{products:{productId:req.query.id}}})
            
            if(remove){
                res.redirect('/cart')
            }
        } catch (error) {
            console.log(error.message)
        }
    }


    const changeCount=async(req,res)=>{
        try {
            
            const userid=req.session.user_id
           
            
             const num=req.body.tcount
             
            if(num>1){
               
              const cartData= await Cart.updateOne({userId:userid,"products._id":req.body.id},{$inc:{"products.$.count":req.body.count}})
             
              if(cartData){
                res.json({success:true})
              }
            }
        } catch (error) {
            console.log(error.message)
        }  
    }





 const CartData =  async(req,res)=>{
    try {

      res.redirect('/checkout')
    } catch (error) {
        console.log(error.message);
    }
 }


 const loadCheckout = async(req,res)=>{
    try{
        const userName = await User.findOne({_id:req.session.user_id});
        const addressData = await Address.findOne({userId:req.session.user_id});
        if(req.session.user_id){
            if(addressData){
                if(addressData.addresses.length>0){
                    const address = addressData.addresses;
                    const total = await Cart.aggregate([{$match:{user:userName.name}},{$unwind:"$products"},{$project:{productPrice:"$products.productPrice",count:"$products.count"}},{$group:{_id:null,total:{$sum:{$multiply:["$productPrice","$count"]}}}}]);
                    if(total[0].total>=userName.wallet){
                        const Total = total[0].total
                        const grandTotal = (total[0].total) - userName.wallet ;
                        let customer = true;
                        res.render('checkoutPage',{customer,userName,address,Total,grandTotal});
                    }else{
                        const Total = total[0].total;
                        const grandTotal = 1;   
                        let customer = true;
                        res.render('checkoutPage',{customer,userName,address,Total,grandTotal});
                    }
                }else{
                    let customer = true;
                    res.render('emptyCheckoutPage',{customer,userName,message:"Add your delivery address"});
                }
            }else{
                let customer = true;
                res.render('emptyCheckoutPage',{customer,userName,message:"Add your delivery address"});
            }
        }else{
            res.redirect('/');
        }
    }catch(error){
        console.log(error.message);
    }
}



 module.exports = {
    LoadCart,
    addToCart,
    changeCount,
    cartprDlt,
    CartData,
    loadCheckout
 }