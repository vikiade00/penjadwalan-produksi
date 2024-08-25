const express = require("express");
const {
  getAllCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} = require("../controller/customer.controller");
const verifyToken = require("../middleware/verifyToken.middleware");
const route = express.Router();

route.get("/", verifyToken(["admin", "pemilik", "produksi"]), getAllCustomers);
route.get(
  "/:id",
  verifyToken(["admin", "pemilik", "produksi"]),
  getCustomerById
);
route.post("/", verifyToken(["admin"]), createCustomer);
route.put("/:id", verifyToken(["admin"]), updateCustomer);
route.delete("/:id", verifyToken(["admin"]), deleteCustomer);

module.exports = route;
