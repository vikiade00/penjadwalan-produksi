const mongoose = require("mongoose");

const jadwalProduksiSchema = new mongoose.Schema(
  {
    id_pesanan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Pesanan",
      required: true,
    },
    tanggal_mulai: {
      type: Date,
      default: null,
    },
    tanggal_selesai: {
      type: Date,
      default: null,
    },
    jumlah_produksi: { type: Number, required: true },
    status: {
      type: String,
      enum: [
        "Menunggu",
        "Diproses",
        "Selesai",
        "Dibatalkan",
        "Dijeda",
        "Telat",
      ],
      default: "Menunggu",
    },
    keterangan: {
      type: String,
      default: "",
    },
    bagian_ke: { type: Number },
  },

  { timestamps: true }
);

const JadwalProduksi = mongoose.model("JadwalProduksi", jadwalProduksiSchema);

module.exports = JadwalProduksi;
