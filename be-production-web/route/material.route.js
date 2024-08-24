const express = require("express");
const {
  getAllMaterials,
  getMaterialById,
  createMaterial,
  updateMaterial,
  deleteMaterial,
} = require("../controller/material.controller");
const route = express.Router();

route.get("/", getAllMaterials);
route.get("/:id", getMaterialById);
route.post("/", createMaterial);
route.put("/:id", updateMaterial);
route.delete("/:id", deleteMaterial);

module.exports = route;
