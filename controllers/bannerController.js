const user = require("../models/userModel")
const randomString = require("randomstring")
const product = require("../models/productModel")
const category = require("../models/categoryModel")
const cart = require("../models/cartModel")
const order=require("../models/orderModel")

const banner=require("../models/bannerModel")


const addbanner=async(req,res)=>{
    try {
        res.render("addbanner")
        
    } catch (error) {
        
        console.log(error);
    }
}
const postaddbanner=async(req,res)=>{
    try {
       
        const banners=new banner({
            heading:req.body.heading,
            discription:req.body.discription,
            image:req.file.filename
        })
        await banners.save()
        res.redirect("viewbanner",{banners})      
    } catch (error) {
        console.log(error)
    }
}
const viewbanner=async(req,res)=>{
    try {
        let bannerData=await banner.find()      
            res.render("viewbanner",{bannerData})        
    } catch (error) {
        console.log(error)
        
    }
}
const bannerstatus=async(req,res)=>{
    try {
        let id=req.body.id
       
        let text=req.body.text
        
    
        if(text=="false"){
            await banner.findOneAndUpdate({_id:id},{$set:{status:false}})

        }else if(text=="true"){
            await banner.findOneAndUpdate({_id:id},{$set:{status:true}})

        }

        res.json({status:true})

        
    } catch (error) {
        console.log(error)
       
    }
}
const editbanner=async(req,res)=>{
    try {
        let id=req.params.id
        console.log(id);
        let bannerData=await banner.findOne({_id:id})
        res.render("editbanner",{bannerData})
        
    } catch (error) {
        console.log(error)
       
    }
}
const posteditbanner=async(req,res)=>{
    try {
        let id =req.params.id
      
        if(typeof(req.files==="undefined")){
            await banner.findOneAndUpdate({_id:id},{$set:{
                heading:req.body.heading,
                discription:req.body.discription,
              
            }})


        }else{
            await banner.findOneAndUpdate({_id:id},{$set:{
                heading:req.body.heading,
                discription:req.body.discription,
                image:req.file.filename
            }})

        }
        res.redirect("/admin/viewbanner")


        
    } catch (error) {
        
        console.log(error);
  }
}


module.exports={
    addbanner,
    postaddbanner,
    viewbanner,
    bannerstatus,
    editbanner,
    posteditbanner,

}