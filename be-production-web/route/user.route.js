const express = require("express");
const {
  authenticateUser,
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} = require("../controller/user.controller");
const verifyToken = require("../middleware/verifyToken.middleware");

const route = express.Router();

route.get("/", verifyToken(["pemilik"]), getAllUsers);
route.get("/:id", verifyToken(["pemilik"]), getUser);
route.post("/", verifyToken(["pemilik"]), createUser);
route.put("/:id", verifyToken(["pemilik"]), updateUser);
route.delete("/:id", verifyToken(["pemilik"]), deleteUser);
route.post("/login", authenticateUser);

module.exports = route;
