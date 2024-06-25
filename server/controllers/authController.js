const User = require("../models/userModel");
const Order = require('../models/orderModel')
const {hashPassword,comparePassword} = require("../helpers/authHelper")
const JWT = require('jsonwebtoken')

const registerController=async(req,res)=>{      //http://localhost:7050/api/v1/auth/register
    try {
        const { name, email, password, phone, address,answer } = req.body;
        //validations
        if (!name) {
          return res.send({ error: "Name is Required" });
        }
        if (!email) {
          return res.send({ message: "Email is Required" });
        }
        if (!password) {
          return res.send({ message: "Password is Required" });
        }
        if (!phone) {
          return res.send({ message: "Phone no is Required" });
        }
        if (!address) {
          return res.send({ message: "Address is Required" });
        }
        if (!answer) {
          res.status(400).send({ message: "answer is required" });
        }
        
        //check user
        const exisitingUser = await User.findOne({ email });
        //exisiting user
        if (exisitingUser) {
          return res.status(200).send({
            success: false,
            message: "Already Register please login",
          });
        }
        //register user
        const hashedPassword = await hashPassword(password);
        //save
        const user = await User.create({  name,  email,  phone,  address,  password: hashedPassword , answer });
    
        res.status(201).send({
          success: true,
          message: "User Register Successfully",
          user,
        });
      } catch (error) {
        console.log(error);
        res.status(500).send({
          success: false,
          message: "Errro in Registeration",
          error,
        });
      }
}

//POST LOGIN
const loginController = async (req, res) => {   //http://localhost:7050/api/v1/auth/login
    try {
      const { email, password } = req.body;
      //validation
      if (!email || !password) {
        return res.status(404).send({
          success: false,
          message: "Invalid email or password",
        });
      }
      //check user
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).send({
          success: false,
          message: "Email is not registerd",
        });
      }
      const match = await comparePassword(password, user.password);
      if (!match) {
        return res.status(200).send({
          success: false,
          message: "Invalid Password",
        });
      }
      //token create
      const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });

      res.status(200).send({
        success: true,
        message: "login successfully",
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          address: user.address,
          role: user.role,
        },
        token,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Error in login",
        error,
      });
    }
  };

// const testController=(req,res)=>{
//   res.status(200).send("Access done test")
// }  

//forgotPasswordController

const forgotPasswordController = async (req, res) => {
  try {
    const { email, answer, newPassword } = req.body;
    if (!email) {
      res.status(400).send({ message: "Emai is required" });
    }
    if (!answer) {
      res.status(400).send({ message: "answer is required" });
    }
    if (!newPassword) {
      res.status(400).send({ message: "New Password is required" });
    }
    //check
    const user = await User.findOne({ email, answer });
    //validation
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Wrong Email Or Answer",
      });
    }
    const hashed = await hashPassword(newPassword);
    await User.findByIdAndUpdate(user._id, { password: hashed });
    res.status(200).send({
      success: true,
      message: "Password Reset Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Something went wrong",
      error,
    });
  }
};

//update profile when u are loggedIn and Entering data from frontend
const updateProfileController=async(req,res)=>{
  try {
    const {name,password,address,phone}=req.body;
    const user= await User.findById(req.userHA._id);
    
    //password
    if(password && password.length < 5){
      return res.json({error:"Password is required 5 character long"})
    }
    const hashedPassword= password ? await hashPassword(password) : undefined     //call hashPassword function /authHepler

    const updateUser = await User.findByIdAndUpdate( req.userHA._id,{
      name:name||user.name,
      password:hashedPassword||user.password,
      address:address||user.address,
      phone:phone||user.phone,
  },{new:true});

    res.status(200).send({
      success: true,
      message: "Update Successfully",
      updateUser
    })
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while updating profile",
      error,
    });
  }
}

//orders
const getOrdersController=async(req,res)=>{
  try {
    const orders= await Order.find({buyer:req.userHA._id}).populate("products","-photo").populate("buyer","name")
    res.json({orders})
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while getting Orders",
      error,
    });
  }
}

//all orders by admin
const getAllOrdersController=async(req,res)=>{
   try {
    const orders= await Order.find({}).populate("products","-photo").populate("buyer","name").sort({createdAt:"-1"});
    res.json({orders})  
   } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while getting All Orders through Admin",
      error,
    });
   } 
}

//order status update
const orderStatusController=async(req,res)=>{
  try {
    const {orderId} = req.params
    const {status} = req.body
    const orders = await Order.findByIdAndUpdate(orderId,{status},{new:true})
    res.json({orders});
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while update Orders through Admin",
      error,
    });
  }
}

module.exports ={registerController,loginController,forgotPasswordController,updateProfileController,getOrdersController,getAllOrdersController,orderStatusController}