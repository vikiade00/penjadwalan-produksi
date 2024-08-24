const mongoose = require("mongoose");
const dayjs = require("dayjs");

// Fungsi untuk menghasilkan kode dengan ID MongoDB
async function generateKode(model, prefix, kodeField = "kode") {
  const currentMonthYear = dayjs().format("MMYY").toUpperCase(); // Dapatkan bulan dan tahun saat ini dengan format MMYY dan ubah ke uppercase

  // Cari entitas terakhir yang dibuat pada bulan dan tahun ini
  const lastEntry = await model
    .findOne({
      [kodeField]: { $regex: `^${prefix}-${currentMonthYear}-` },
    })
    .sort({ created_at: -1 });

  // Tambahkan ID MongoDB yang dihasilkan untuk memastikan keunikan lebih lanjut
  const newId = new mongoose.Types.ObjectId().toString().toUpperCase(); // Menghasilkan ID MongoDB baru dan ubah ke uppercase

  // Format kode dengan prefix, bulan-tahun, dan bagian awal dari ID MongoDB
  return `${prefix}-${currentMonthYear}-${newId.slice(0, 8)}`;
}

module.exports = generateKode;
