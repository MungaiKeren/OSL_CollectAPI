const jwt = require("jsonwebtoken");

const config = process.env;

const verifyToken = (req, res, next) => {
  const token = req.cookies.wkwp_cookie;

  // if (!token) {
  //   return res.status(203).send({error:"A token is required for authentication"});
  // }
  // try {
  //   const decoded = jwt.verify(token, config.TOKEN_KEY);
  //   req.user = decoded;
  // } catch (err) {
  //   return res.status(203).send({error:"Invalid Token"});
  // }
  return next();
};

module.exports = verifyToken;
