const express = require("express");
const {
  createSPK,
  getJadwalProduksiByPrioritas,
  getProduksiPerPeriode,
} = require("../controller/jadwalProduksi.controller");
const route = express.Router();

route.post("/spk", createSPK);
route.get("/prioritas", getJadwalProduksiByPrioritas);
route.get("/grafik-produksi/periode", getProduksiPerPeriode);

module.exports = route;
