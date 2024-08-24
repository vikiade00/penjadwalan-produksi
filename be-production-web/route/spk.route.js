const express = require("express");
const {
  getAllSPK,
  getSPKById,
  updateSPKStatus,
} = require("../controller/spk.controller");
const route = express.Router();

route.get("/", getAllSPK);
route.get("/:id", getSPKById);
route.put("/:id", updateSPKStatus);

module.exports = route;
