const express=require('express');
const { requireSignIn, isAdmin } = require('../middlewares/authMiddleware');
const { createCategoryController, updateCategoryController, getAllCategoryController, singleCategoryController, deleteCategoryController } = require('../controllers/categoryController');

const router =express.Router();

//routes
//create category || POST
router.route('/create-category').post(requireSignIn,isAdmin,createCategoryController);

//update category || PATCH
router.route('/update-category/:id').patch(requireSignIn,isAdmin,updateCategoryController);

//getAll category || get
router.route('/get-category').get(getAllCategoryController);

//single category
router.route('/single-category/:slug').get(singleCategoryController);

//delete category
router.route('/delete-category/:id').delete(requireSignIn,isAdmin, deleteCategoryController);


module.exports = router;