// middlewares/verifyToken.middleware.js
const jwt = require("jsonwebtoken");

const verifyToken = (allowedRoles) => {
  return (req, res, next) => {
    try {
      const header = req.headers.authorization;
      if (!header) throw new Error("Invalid header");

      const token = header.split(" ")[1];
      if (!token) throw new Error("There is no token");

      const decodedToken = jwt.verify(token, process.env.JWT_KEY);

      if (allowedRoles && !allowedRoles.includes(decodedToken.role)) {
        throw new Error("Unauthorized role");
      }

      req.user = decodedToken;

      next();
    } catch (error) {
      res.status(401).json({ message: "Unauthorized" });
    }
  };
};

module.exports = verifyToken;
