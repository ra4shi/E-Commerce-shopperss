const mongoose = require("mongoose")

const dotenv = require('dotenv')
dotenv.config();

mongoose.connect(process.env.mongodb);

const express= require("express");

const app = express();

const path =require('path')




//for user routes

app.use(express.static('public/user'))
app.use(express.static(path.join(__dirname,'public')))



const userRoute = require('./routes/userRoute')
app.use('/',userRoute);

// for admin routes



app.use(express.static('public/admin'))

const adminRoute = require('./routes/adminRoute')
app.use('/admin', adminRoute);

app.use((req, res, next) => {
  res.header(
    "Cache-Control",
    "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
  );
  next();
});

app.listen(3000, () => {
  console.log("server start.....")
})