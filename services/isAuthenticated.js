const {  users } = require("../model");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");

exports.isAuthenticated = async (req, res, next) => {
  const token = req.cookies.token;
  console.log(token);
  
  if (!token) {
    return res.send({
      status: 401,
      message: "You must be logged in",
    });
  }

  //using promisify , we don't need to handle the callback of the jwt
  const decoded = await promisify(jwt.verify)(token, "hello");
  console.log(decoded);
 

  const loggedInUser = await users.findAll({ where: { id: decoded.id } });
  console.log(loggedInUser);
  if (loggedInUser.length == 0) {
    return res.status(400).json({
      message: "You are not the user belonging to this token",
    });
  }
  req.userId = loggedInUser[0].id;
  next(); // yala add blog ma lancha 
  
};



