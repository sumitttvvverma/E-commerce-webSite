const slugify = require('slugify');
const Category = require("../models/categoryModel");


const createCategoryController=async(req,res)=>{        //http://localhost:7050/api/v1/category/create-category
    try {
        const {name}=req.body;
        if (!name) {
            return res.status(401).send({ message: "Name is required" });
          }
          const existingCategory = await Category.findOne({ name });
          if (existingCategory) {
            return res.status(200).send({
              success: false,
              message: "Category Already Exisits",
            });
          }  
          const category = await Category.create({ name, slug: slugify(name), });  //slugify [npm i slugify]  used for add - between space
          res.status(201).send({
            success: true,
            message: "new category created",
            category,
          });
    } catch (error) {
        console.log(error);
        res.status(500).send({
          success: false,
          error,
          message: "Error in create Category",
        });
      }
}

//update category || PATCH
const updateCategoryController=async(req,res)=>{  //http://localhost:7050/api/v1/category/update-category/666c63af09751472641feb8b
    try {
        const {name}=req.body;
        const updateC= await Category.updateOne({_id:req.params.id},{ name, slug: slugify(name) })
        res.status(201).send({
          success: true,
          message: " category updated",
          updateC,
        });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        error,
        message: "Error in update Category",
      });
    }
}

// getAll category || GET
const getAllCategoryController=async(req,res)=>{    //http://localhost:7050/api/v1/category/get-category/
  try {
    const getCategory = await Category.find({});
    res.status(201).send({
      success: true,
      message: "all categorire List ",
      getCategory,
    });
  } catch (error) {
    console.log(error);
      res.status(500).send({
        success: false,
        error,
        message: "Error in getAll Category",
      });
  }
}

//single category
const singleCategoryController=async(req,res)=>{    //http://localhost:7050/api/v1/category/single-category/kids-collections
  try {
    const getSingleCategory = await Category.findOne({slug:req.params.slug});
    res.status(201).send({
      success: true,
      message: "single category ",
      getSingleCategory,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      error,
      message: "Error in get single Category",
    });
  }
}

//delete category
const deleteCategoryController=async(req,res)=>{    //http://localhost:7050/api/v1/category/delete-category/666d2741e5feb94914f30608
  try {
    await Category.deleteOne({_id:req.params.id});  
    res.status(201).send({
      success: true,
      message: "delete category ",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      error,
      message: "Error in delete single Category",
    });
  }
}

module.exports={createCategoryController,updateCategoryController,getAllCategoryController,singleCategoryController,deleteCategoryController}