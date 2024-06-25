const express = require('express');
const { registerController, loginController, testController, forgotPasswordController, updateProfileController, getOrdersController, getAllOrdersController, orderStatusController } = require('../controllers/authController');
const { requireSignIn, isAdmin } = require('../middlewares/authMiddleware');

const router = express.Router();

//routes
//REGISTER || POST
router.route('/register').post(registerController);

//LOGIN || POST
router.route('/login').post(loginController);

//test
// router.route('/test').get(requireSignIn, isAdmin,testController)

//Forgot Password || POST
router.route('/forgot-password').post(forgotPasswordController);

//protected user route auth
router.route('/user-auth').get(requireSignIn,(req,res)=>{
    res.status(200).send({ok:true});
});

//protected admin route auth
router.route('/admin-auth').get(requireSignIn,isAdmin,(req,res)=>{
    res.status(200).send({ok:true});
});

//update profile
router.route('/profile').put(requireSignIn,updateProfileController)

//user orders
router.route('/orders').get(requireSignIn,getOrdersController);

//all orders by admin
router.route('/all-orders').get(requireSignIn, isAdmin,getAllOrdersController);

//order status update
router.route('/order-status/:orderId').put(requireSignIn, isAdmin,orderStatusController);


module.exports= router;