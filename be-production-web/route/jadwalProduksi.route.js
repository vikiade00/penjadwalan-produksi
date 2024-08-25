const express = require("express");
const {
  createSPK,
  getJadwalProduksiByPrioritas,
  getProduksiPerPeriode,
} = require("../controller/jadwalProduksi.controller");
const verifyToken = require("../middleware/verifyToken.middleware");
const route = express.Router();

route.post("/spk", verifyToken(["admin"]), createSPK);
route.get(
  "/prioritas",
  verifyToken(["admin", "pemilik", "produksi"]),
  getJadwalProduksiByPrioritas
);
route.get(
  "/grafik-produksi/periode",
  verifyToken(["admin", "pemilik", "produksi"]),
  getProduksiPerPeriode
);

module.exports = route;
