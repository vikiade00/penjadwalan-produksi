const express = require("express");
const {
  getAllCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} = require("../controller/customer.controller");
const route = express.Router();

route.get("/", getAllCustomers);
route.get("/:id", getCustomerById);
route.post("/", createCustomer);
route.put("/:id", updateCustomer);
route.delete("/:id", deleteCustomer);

module.exports = route;
