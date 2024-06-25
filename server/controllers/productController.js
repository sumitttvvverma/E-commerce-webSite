const Product = require('../models/productModel.js');
const Category = require('../models/categoryModel.js');
const slugify=require('slugify')
const fs=require('fs');
const braintree = require("braintree");
const Order = require('../models/orderModel.js');


//payment gateway
var gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});

//create product
const createProductController=async(req,res)=>{        //http://localhost:7050/api/v1/product/create-product 
    try {
        const { name, description, price, category, quantity, shipping } =  req.fields;
       const {photo}=req.files;
       //validation
        switch (true) {
            case !name:
                return res.status(500).send({ error: "Name is Required" });
            case !description:
                return res.status(500).send({ error: "Description is Required" });
            case !price:
                return res.status(500).send({ error: "Price is Required" });
            case !category:
                return res.status(500).send({ error: "Category is Required" });
            case !quantity:
                return res.status(500).send({ error: "Quantity is Required" });    
            case !photo && photo.size > 1000000:
                return res.status(500).send({ error: "photo is Required and should be less then 1mb" })    
        }

        const newProduct = new Product({ ...req.fields, slug: slugify(name) });
        if (photo) {
          newProduct.photo.data = fs.readFileSync(photo.path);
          newProduct.photo.contentType = photo.type;
        }
        await newProduct.save();
        res.status(201).send({
          success: true,
          message: "Product Created Successfully",
          newProduct,
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            error,
            message: "Error in create Product",
          });      
    }
}

//get all product
const getProductController=async(req,res)=>{    //http://localhost:7050/api/v1/product/get-product
    try {                                                   //photo nhi aayga ,diff categories show krega limit only 12
        const products = await Product.find({}).populate('category').select("-photo").limit(12).sort({createdAt:-1});
        res.status(200).send({
            success: true,
            countTotal: products.length,
            message: "ALlProducts ",
            products,
          });
    } catch (error) {
        console.log(error);
        res.status(500).send({
          success: false,
          message: "Erorr in getting products",
          error: error.message,
        });
    }    
}

//get single product
const getSingleProductController=async(req,res)=>{      //http://localhost:7050/api/v1/product/get-product/BT-watch
    try {
        const product = await Product.findOne({slug:req.params.slug}).select('-photo').populate('category')
        res.status(200).send({
            success: true,
            message: "Single Product Fetched",
            product,
          });
    } catch (error) {
        console.log(error);
        res.status(500).send({
          success: false,
          message: "Eror while getitng single product",
          error,
        });
    }
}

//get photo
const productPhotoController=async(req,res)=>{      //http://localhost:7050/api/v1/product//product-photo/666d99d341e57977dc52d0dd
    try {
        const product=await Product.findOne({_id:req.params.pid}).select('photo'); //only photo milegi bs
        if (product.photo.data) {   //how ,to know look productModel ., pid=product ki id bs naam h kuch nhi 
            //set the response
            res.set("Content-type", product.photo.contentType);
            return res.status(200).send(product.photo.data);
          }
    } catch (error) {
        console.log(error);
        res.status(500).send({
        success: false,
        message: "Erorr while getting photo",
        error,
        });
    }
}

//delete product
const deleteProductController = async (req, res) => {   //http://localhost:7050/api/v1/product/delete-product/:pid
    try {
      await Product.deleteOne({_id:req.params.pid}).select("-photo");
      res.status(200).send({
        success: true,
        message: "Product Deleted successfully",
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Error while deleting product",
        error,
      });
    }
  };

//update product
const updateProductController = async (req, res) => {     //http://localhost:7050/api/v1/product/update-product/666d99d341e57977dc52d0dd
  try {
    const { name, description, price, category, quantity, shipping } =
    req.fields;
    const { photo } = req.files;
    //validation
    switch (true) {
      case !name:
        return res.status(500).send({ error: "Name is Required" });
      case !description:
        return res.status(500).send({ error: "Description is Required" });
      case !price:
        return res.status(500).send({ error: "Price is Required" });
      case !category:
        return res.status(500).send({ error: "Category is Required" });
      case !quantity:
        return res.status(500).send({ error: "Quantity is Required" });
      case photo && photo.size > 1000000:
        return res
          .status(500)
          .send({ error: "photo is Required and should be less then 1mb" });
       }
       //update if photo also available
       const updateProduct = await Product.findByIdAndUpdate(
        req.params.pid,
        { ...req.fields, slug: slugify(name) },
        { new: true }
      );
      if (photo) {
        updateProduct.photo.data = fs.readFileSync(photo.path);
        updateProduct.photo.contentType = photo.type;
      }
      await updateProduct.save();
      res.status(201).send({
        success: true,
        message: "Product Updated Successfully",
        updateProduct,
      });   

  } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        error,
        message: "Error in Update product",
      });
  }
}  

//filters from backend side
const productFiltersController=async(req,res)=>{
  try {
    const {checked,radio} = req.body;  //both are in Forntend page as State noOne in Productmodel
    let args={}
    if(checked.length>0) args.category=checked
    if(radio.length) args.price={$gte: radio[0],$lte: radio[1] }; //greater than equal , less than equal
    const products = await Product.find(args);
    res.status(200).send({
      success:true,
      products
    }) 
  } catch (error) {
    console.log(error);
      res.status(500).send({
        success: false,
        error,
        message: "Error in Filtering product",
      });
  }
}

//product count
const productCountController=async(req,res)=>{
  try {
    const total = await Product.count({});
    res.status(200).send({
      success: true,
      total,
    });
  } catch (error) {
    console.log(error);
      res.status(500).send({
        success: false,
        error,
        message: "Error in product count",
      });
  }
}

//product per page
const productListController=async(req,res)=>{
  try {
    const perPage = 6;
    const page = req.params.page ? req.params.page : 1;
    const products = await Product
      .find({})
      .select("-photo")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
      res.status(500).send({
        success: false,
        error,
        message: "Error in product per page",
      });
  }
}

//search product
const searchProductController=async(req,res)=>{
  try {
    const {keyword} = req.params
    const results= await Product.find({
      $or:[
        {name:{$regex:keyword,$options:"i"}},
        {description:{$regex:keyword,$options:"i"}},
      ]
    }).select("-photo");
    res.json(results);
  } catch (error) {
    console.log(error);
      res.status(500).send({
        success: false,
        error,
        message: "Error in Search product",
      });
  }
}

//similar product
const relatedProductController=async(req,res)=>{
  try {
    const { pid, cid } = req.params;
    const products = await Product.find({
        category: cid,
        _id: { $ne: pid },  //no includeded
      })
      .select("-photo")
      .limit(3)
      .populate("category");
    res.status(200).send({
      success: true,
      products,
    });

  } catch (error) {
    console.log(error);
      res.status(500).send({
        success: false,
        error,
        message: "Error in related product",
      });
  }
}

//category wise product
const productCategoryController=async(req,res)=>{
    try {
      const category=await Category.findOne({slug:req.params.slug});
      const products=await Product.find({category:category}).populate('category');
      res.status(200).send({
        success: true,
        category,
        products,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        error,
        message: "Error in get category wise product",
      });
    }
}

//payment gateway api
//token
const braintreeTokenController=async(req,res)=>{
    try {
      gateway.clientToken.generate({},function(err,response){
        if(err){
          return res.status(500).send(err)
        }else{
          res.send(response);
        }
      })
    } catch (error) {
         console.log(error);
    }
}

//payment
const braintreePaymentController=async(req,res)=>{
  try {
    const {cart,nonce}=req.body;
    let total=0
    cart.map((i)=>(total+=i.price));
    //transaction
    let newTransaction = gateway.transaction.sale(
        {
        amount:total,
        paymentMethodNonce:nonce,
        options:{
          submitForSettlement: true,
            },
        },
        function (error,result){
          if(result){
            const order = new Order({
              products:cart,
              payment:result,
              buyer:req.userHA._id
            }).save();
            res.json({ok:true})
          }else{
            res.status(500).send(error)
          }
        }
    );

  } catch (error) {
    console.log(error)
  }
}

module.exports={createProductController,getProductController,getSingleProductController,productPhotoController,deleteProductController,
  updateProductController,productFiltersController,productCountController,productListController,searchProductController,relatedProductController,
  productCategoryController,braintreeTokenController,braintreePaymentController}