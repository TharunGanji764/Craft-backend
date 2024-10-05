const jwtToken = require("jsonwebtoken");

const secret_key = process.env.SECRETE_TOKEN;

const authenticate = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  let token = authHeader && authHeader.replace("Bearer ", "");
  if (token === undefined) {
    res.status(401).json({ error: "Jwt Token Not Found" });
  } else {
    jwtToken.verify(token, secret_key, async (error, payload) => {
      if (error) {
        res.status(401).json({ error: "Invalid Jwt Token" });
      }
      req.id = payload.userId;
      next();
    });
  }
};

module.exports = authenticate;
