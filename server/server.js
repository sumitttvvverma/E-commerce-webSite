require('dotenv').config()
const express=require('express');
const connectDb = require('./utils/db');
const authRoute = require('./routes/authRoute');
const categoryRoute=require('./routes/categoryRoute');
const productRoute=require('./routes/productRoute');
const cors = require('cors');

const app= express();

//middleware
app.use(cors());
app.use(express.json())

//routes
app.use('/api/v1/auth',authRoute);
app.use('/api/v1/category',categoryRoute);
app.use('/api/v1/product',productRoute);

//basic api 
app.get('/',(req,res)=>{
    res.status(200).send("welcome its run")
})

const PORT=7050;

connectDb().then(()=>{

    app.listen(PORT,()=>{
        console.log(`server is running at ${PORT}`);
    })

})
