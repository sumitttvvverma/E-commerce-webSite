const express = require('express');
const { requireSignIn, isAdmin } = require('../middlewares/authMiddleware');
const { createProductController, getProductController, getSingleProductController, productPhotoController, deleteProductController, updateProductController, productFiltersController, productCountController, productListController, searchProductController, relatedProductController, productCategoryController, braintreeTokenController, braintreePaymentController } = require('../controllers/productController');
const formidable =require('express-formidable');

const router = express.Router();

//routes
//create product || POST
router.route('/create-product').post(requireSignIn,isAdmin,formidable() ,createProductController);

//update product || PUTT
router.route('/update-product/:pid').put(requireSignIn,isAdmin,formidable() ,updateProductController);

//get product
router.route('/get-product').get(getProductController);

//get single product
router.route('/get-product/:slug').get(getSingleProductController);

//get photo
router.route('/product-photo/:pid').get(productPhotoController);

//delete photo
router.route('/delete-product/:pid').delete(deleteProductController);

//filter product
router.route('/product-filters').post(productFiltersController);

//product count
router.route('/product-count').get(productCountController);

//product per page
router.route('/product-list/:page').get(productListController);

//for search product
router.route('/search/:keyword').get(searchProductController);

//for similar product
router.route('/related-product/:pid/:cid').get(relatedProductController);

//categor wise product
router.route('/product-category/:slug').get(productCategoryController);

//products routes
//token
router.route('/braintree/token').get(braintreeTokenController);

//payments
router.route('/braintree/payment').post(requireSignIn,braintreePaymentController);

// for cart
router.route('/check-cart').get(requireSignIn,(req,res)=>{
   res.status(200).send({ok:true});
});

module.exports=router;