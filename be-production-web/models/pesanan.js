const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);
const dayjs = require("dayjs");

// Definisikan schema Pesanan
const pesananSchema = new mongoose.Schema(
  {
    id_customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    kode_pesanan: {
      type: String,
      unique: true, // Pastikan kode_pesanan unik
    },
    nama_produk: {
      type: String,
      required: true,
    },
    tanggal_pesanan: {
      type: Date,
      default: Date.now,
    },
    tanggal_tenggat: {
      type: Date,
      required: true,
    },
    jumlah_produksi: {
      type: Number,
      required: true,
    },
    status_pesanan: {
      type: String,
      enum: ["Menunggu", "Diproses", "Selesai", "Dibatalkan", "Dijeda", "Telat"],
      default: "Menunggu",
    },
    prioritas_pesanan: {
      type: String,
      enum: ["Rendah", "Sedang", "Tinggi"],
      default: "Sedang",
    },
    keterangan: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

// Menambahkan plugin auto-increment ke schema
pesananSchema.plugin(AutoIncrement, {
  inc_field: "sequence_number", // Field untuk menyimpan angka auto-increment
  start_seq: 1, // Mulai dari 1
  id: "pesananSeq", // ID untuk collection sequence
});

// Middleware untuk menggabungkan auto-increment dengan format tanggal setelah disimpan
pesananSchema.post("save", async function (doc, next) {
  if (!doc.kode_pesanan) {
    const currentDate = dayjs().format("DDMMYY"); // Format tanggal
    doc.kode_pesanan = `ORD${currentDate}${String(doc.sequence_number).padStart(
      4,
      "0"
    )}`;
    await doc.save(); // Simpan lagi untuk menyimpan kode_pesanan
  }
  next();
});

const Pesanan = mongoose.model("Pesanan", pesananSchema);

module.exports = Pesanan;
