const jwt = require("jsonwebtoken");
const { BadRequestError } = require("../errors");

// login/register/signUp setup
const login = async (req, res) => {
  const { username, password } = req.body;
  // 3 types of validations are:
  // mongoose validation
  // Joi
  // Check in controller

  //  using CustomAPIError for checking for empty values
  if (!username || !password) {
    throw new BadRequestError("Please provide email and password");
  }

  // this is just a demo id, usually it is provide by the db
  const id = new Date().getDate();

  // defining the token, small payload
  // in production use long unguessable string value for JWT secret
  const token = jwt.sign({ id, username }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  res.status(200).json({ msg: "user creeated", token });
};

// setup for dashboard , only can be accessed with JWT
const dashboard = async (req, res) => {
  console.log(req.user);
  const luckyNumber = Math.floor(Math.random() * 100);

  res.status(200).json({
    msg: `Hello, ${req.user.username}`,
    secret: `Here is your authorized data, your lucky number is ${luckyNumber}`,
  });
};

module.exports = {
  login,
  dashboard,
};
