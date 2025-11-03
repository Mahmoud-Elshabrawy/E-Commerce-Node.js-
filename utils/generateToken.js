const jwt = require("jsonwebtoken");


const generateToken = (id) => {
  return jwt.sign({ id, ts: Date.now() }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE_IN,
  });
};

module.exports = generateToken