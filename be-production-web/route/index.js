const express = require("express");
const route = express.Router();
const customerRoute = require("./customer.route");
const pesananRoute = require("./pesanan.route");
const jadwalRoute = require("./jadwalProduksi.route");
const spkRoute = require("./spk.route");
const userRoute = require("./user.route");
const cetakRoute = require("./cetak.route");

route.get("/", (req, res) => {
  try {
    res
      .status(200)
      .json("Selamat datang di API Jadwal Produksi Konveksi Tumini");
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

route.use("/users", userRoute);
route.use("/customers", customerRoute);
route.use("/pesanan", pesananRoute);
route.use("/jadwal", jadwalRoute);
route.use("/spk", spkRoute);
route.use("/cetak", cetakRoute);

module.exports = route;
