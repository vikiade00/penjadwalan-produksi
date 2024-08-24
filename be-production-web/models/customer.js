const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);
const dayjs = require("dayjs");

// Definisikan schema Customer
const customerSchema = new mongoose.Schema({
  kode_customer: {
    type: String,
    unique: true,
  },
  nama: {
    type: String,
    required: true,
  },
  alamat: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  no_telepon: {
    type: String,
    required: true,
  },
  tanggal_bergabung: {
    type: Date,
    default: Date.now,
  },
  keterangan: {
    type: String,
    default: "",
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

// Menambahkan plugin auto-increment ke schema
customerSchema.plugin(AutoIncrement, {
  inc_field: "sequence_number", // Field untuk menyimpan angka auto-increment
  start_seq: 1, // Mulai dari 1
  id: "customerSeq", // ID untuk collection sequence
});

// Middleware untuk menggabungkan auto-increment dengan format tanggal setelah disimpan
customerSchema.post("save", async function (doc, next) {
  if (!doc.kode_customer) {
    const currentDate = dayjs().format("DDMMYY"); // Format tanggal
    doc.kode_customer = `CUS${currentDate}${String(
      doc.sequence_number
    ).padStart(4, "0")}`;
    await doc.save(); // Simpan lagi untuk menyimpan kode_customer
  }
  next();
});

const Customer = mongoose.model("Customer", customerSchema);

module.exports = { Customer };
