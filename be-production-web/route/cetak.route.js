const express = require("express");
const {
  cetakSemuaPeriode,
  cetakHarian,
  cetakMingguan,
  cetakTahunan,
  cetakBerdasarkanStatus,
} = require("../controller/cetak.controller");
const verifyToken = require("../middleware/verifyToken.middleware");
const route = express.Router();

route.get(
  "/semua-periode",
  verifyToken(["admin", "pemilik", "produksi"]),
  cetakSemuaPeriode
);
route.get(
  "/harian",
  verifyToken(["admin", "pemilik", "produksi"]),
  cetakHarian
);
route.get(
  "/mingguan",
  verifyToken(["admin", "pemilik", "produksi"]),
  cetakMingguan
);
route.get(
  "/tahunan",
  verifyToken(["admin", "pemilik", "produksi"]),
  cetakTahunan
);
route.get(
  "/status",
  verifyToken(["admin", "pemilik", "produksi"]),
  cetakBerdasarkanStatus
);

module.exports = route;
