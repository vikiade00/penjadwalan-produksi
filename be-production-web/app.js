const express = require("express");
const cors = require("cors");

const db = require("./config/db");
const allRoute = require("./route");

const app = express();
const PORT = process.env.PORT || 3000;

const corsOptions = {
  origin: "http://localhost:5173",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(allRoute);

db.then(() => {
  console.log("Berhasil connect ke mongoose db jadwal konveksi");
}).catch((error) => {
  console.log("Gagal connect ke mongoose " + error);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
