const express = require("express");
const {
  getAllPesanan,
  getPesananById,
  createPesanan,
  updatePesanan,
  deletePesanan,
} = require("../controller/pesanan.controller");
const verifyToken = require("../middleware/verifyToken.middleware");

const route = express.Router();

route.get("/", verifyToken(["admin", "pemilik", "produksi"]), getAllPesanan);
route.get(
  "/:id",
  verifyToken(["admin", "pemilik", "produksi"]),
  getPesananById
);
route.post("/", verifyToken(["admin"]), createPesanan);
route.put("/:id", verifyToken(["admin"]), updatePesanan);
route.delete("/:id", verifyToken(["admin"]), deletePesanan);

module.exports = route;
