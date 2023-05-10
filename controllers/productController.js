const Product =require('../models/productModel')

const Category = require('../models/categoryModel')
const cartModel = require('../models/cartModel')
const coupon = require('../models/couponModel')

// product admin 

const insertProduct=async(req,res)=>{
    try{

        const image=[]
        for(let i=0;i<req.files.length;i++){
            image[i]=req.files[i].filename
        }

       const newproduct= new Product({
            
            name:req.body.name,
            price:req.body.price,
            Category:req.body.Category,
            image:image,
            description:req.body.description,
            stock:req.body.stock,
            size:req.body.size,
           
       })
          await newproduct.save()

          res.redirect('/admin/product')

    }catch(error){
        console.log(error.message)
    }

}

const deleteProduct = async (req,res)=>{
    
    try {
        const id = req.query.id;

        const data = await Product.findByIdAndDelete({_id:id})
        
        if(data){
            res.redirect('/admin/products')
        }
    } catch (error) {
        console.log(error.message);
    }
}


const loadeditProduct = async (req,res)=>{
    try {
        
        const id=req.query.id;
        const productdata = await Product.findById({_id:id})
        console.log(productdata);
        const categorydata = await Category.find()
        console.log(productdata);
        res.render('editproduct',{newproduct:productdata,categorydata})
        
    } catch (error) {
        console.log(error.message);
    }
}


const addeditProduct = async (req,res)=>{
    try {
        const image=[]
        for(let i=0;i<req.files.length;i++){
            image[i]=req.files[i].filename
        }
        const id = req.query.id;
       const a= await Product.findByIdAndUpdate({_id:id},
            {$set:{name: req.body.name,
            price: req.body.price,
            Category: req.body.Category,
            stock: req.body.stock,
            size: req.body.size,
            
            image: image,
            description: req.body.description,
            }})
    console.log(a);
            res.redirect('/admin/products')
    } catch (error) {
        console.log(error.message);
    }
}

const loadaddProduct = async (req,res)=>{
    try{
        const data= await Category.find()
      
        res.render('addproducts',{Category:data})
    }catch(error){
        console.log(error.message)
    }

}

const loadProducts = async (req,res)=>{
    try {
        const data = await Product.find()
        res.render('products',{Product:data})
    } catch (error) {
        console.log(error.message);
    }
}



module.exports = {

    insertProduct,
    loadProducts,
    deleteProduct,
    loadeditProduct,
    addeditProduct,
    loadaddProduct,

}