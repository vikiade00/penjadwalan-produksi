const express = require("express");
const {
  authenticateUser,
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} = require("../controller/user.controller");

const route = express.Router();

route.get("/", getAllUsers);
route.get("/:id", getUser);
route.post("/", createUser);
route.put("/:id", updateUser);
route.delete("/:id", deleteUser);
route.post("/login", authenticateUser);

module.exports = route;
