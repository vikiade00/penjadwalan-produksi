const express = require("express");
const {
  getAllSPK,
  getSPKById,
  updateSPKStatus,
} = require("../controller/spk.controller");
const verifyToken = require("../middleware/verifyToken.middleware");
const route = express.Router();

route.get("/", verifyToken(["admin", "pemilik", "produksi"]), getAllSPK);
route.get("/:id", verifyToken(["admin", "pemilik", "produksi"]), getSPKById);
route.put("/:id", verifyToken(["produksi"]), updateSPKStatus);

module.exports = route;
