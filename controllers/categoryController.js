const Category = require('../models/categoryModel')
const Product = require('../models/productModel')





//categery section

const loadCategory  = async (req,res) => {
    try {

        const Data = await Category.find()
        
        res.render('category' , {data:Data})
        
    } catch (error) {
        console.log(error.message);
    }
}


const loadAddcategory = async (req,res)=>{
    try {

        res.render('addcategory')
        
    } catch (error) {
        
    }
}


const addcategory = async (req,res) => {

    try {

        const newCategory = req.body.Category;
        
        const add = new Category({
           
            Category:newCategory,
            is_block:false,

        })
        const data = await add.save()

        if(data){
            res.redirect('/admin/category')
        }
        
    } catch (error) {
        console.log(error.message);
    }
}

const deletecategory = async (req,res)=>{
    try {
        const id = req.query.id;
        const data = await Category.findByIdAndDelete(id);
        if(data){
            res.redirect('/admin/category');
        }
    } catch (error) {
        console.log(error.message);
    }
}


const editcategory = async (req,res)=>{

    try {

        const id = req.query.id
        const cate = req.body.Category;
        
        const data = await Category.find({_id:id})
        
        console.log(data);

      if(data){
        res.render('editcategory',{data})
      }

    } catch (error) {
        console.log(error.message);
    }
}

const ShowCatagory = async (req, res) => {
    try {
        const productCount = (await Product.find({list:true})).length
        const limit=2
        const totalPage = Math.ceil(productCount/limit)
        const page = Number(req.query.page)||1;
        const skip = limit * (page-1);
        const Id = req.query.id
        const Data = await Product.find({ Category: Id })
        const categoryData = await Category.find()
        res.render('shop', {productdata:Data,totalPage,categoryData})
    } catch (error) {
        console.log(error.message);
    }
}


module.exports = {

    loadCategory,
    loadAddcategory,
    addcategory,
    deletecategory,
    editcategory,
    ShowCatagory
}