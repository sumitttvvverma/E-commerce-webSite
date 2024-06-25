const JWT = require("jsonwebtoken");
const User = require("../models/userModel");

//Protected Routes token base
 const requireSignIn = async (req, res, next) => {
  try {
    const decode = JWT.verify(  req.headers.authorization,  process.env.JWT_SECRET   );
    req.userHA = decode;
    next();
  } catch (error) {
    console.log(error);
    res.status(401).send({
        success: false,
        error,
        message: "Error in requireSignIn middelware",
      });
  }
};

//admin acceess
 const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.userHA._id);
    if (user.role !== 1) {
      return res.status(401).send({
        success: false,
        message: "UnAuthorized Access",
      });
    } else {
      next();
    }

  } catch (error) {
    console.log(error);
    res.status(401).send({
      success: false,
      error,
      message: "Error in admin middelware",
    });
  }
};

module.exports={requireSignIn,isAdmin}