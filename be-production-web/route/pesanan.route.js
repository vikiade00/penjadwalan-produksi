const express = require("express");
const {
  getAllPesanan,
  getPesananById,
  createPesanan,
  updatePesanan,
  deletePesanan,
} = require("../controller/pesanan.controller");

const route = express.Router();

route.get("/", getAllPesanan);
route.get("/:id", getPesananById);
route.post("/", createPesanan);
route.put("/:id", updatePesanan);
route.delete("/:id", deletePesanan);

module.exports = route;
