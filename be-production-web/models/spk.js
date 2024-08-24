const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);
const dayjs = require("dayjs");

// Definisikan schema SPK
const spkSchema = new mongoose.Schema(
  {
    kode_spk: {
      type: String,
      unique: true,
    },
    id_pesanan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Pesanan",
      required: true,
    },
    id_jadwal_produksi: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "JadwalProduksi",
      required: true,
    },
    tanggal_spk: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["Diproses", "Selesai", "Dibatalkan", "Dijeda", "Telat"],
      default: "Diproses",
    },
    keterangan: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

// Menambahkan plugin auto-increment ke schema
spkSchema.plugin(AutoIncrement, {
  inc_field: "sequence_number", // Field untuk menyimpan angka auto-increment
  start_seq: 1, // Mulai dari 1
  id: "spkSeq", // ID untuk collection sequence
});

// Middleware untuk menggabungkan auto-increment dengan format tanggal setelah disimpan
spkSchema.post("save", async function (doc, next) {
  if (!doc.kode_spk) {
    const currentDate = dayjs(doc.tanggal_spk).format("DDMMYY"); // Format tanggal
    doc.kode_spk = `SPK${currentDate}${String(doc.sequence_number).padStart(
      4,
      "0"
    )}`;
    await doc.save(); // Simpan lagi untuk menyimpan kode_spk
  }
  next();
});

const SPK = mongoose.model("SPK", spkSchema);

module.exports = { SPK };
