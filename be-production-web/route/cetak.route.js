const express = require("express");
const {
  cetakSemuaPeriode,
  cetakHarian,
  cetakMingguan,
  cetakTahunan,
  cetakBerdasarkanStatus,
} = require("../controller/cetak.controller");
const route = express.Router();

route.get("/semua-periode", cetakSemuaPeriode);
route.get("/harian", cetakHarian);
route.get("/mingguan", cetakMingguan);
route.get("/tahunan", cetakTahunan);
route.get("/status", cetakBerdasarkanStatus);

module.exports = route;
