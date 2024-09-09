const Pesanan = require("../models/pesanan");
const JadwalProduksi = require("../models/jadwalProduksi");
const mongoose = require("mongoose");
const { SPK } = require("../models/spk");
const dayjs = require("dayjs"); // Untuk manipulasi tanggal

// Kapasitas produksi per hari
const KAPASITAS_PER_HARI = 100;

// Validasi apakah id valid
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// Fungsi untuk menghitung estimasi selesai berdasarkan kapasitas produksi dan kompleksitas produk
const calculateEstimatedCompletion = (
  tanggal_mulai,
  jumlah_produksi,
  kompleksitas_produk
) => {
  const faktor_kompleksitas = kompleksitas_produk; // Misalnya, 1 hari tambahan per level kompleksitas
  const hari_estimasi =
    Math.ceil(jumlah_produksi / KAPASITAS_PER_HARI) + faktor_kompleksitas; // Menghitung jumlah hari
  return dayjs(tanggal_mulai).add(hari_estimasi, "day").toDate(); // Menambahkan jumlah hari ke tanggal mulai
};

// Bobot prioritas
const WEIGHT_URGENT = 0.4; // Bobot urgensi
const WEIGHT_COMPLEXITY = 0.2; // Bobot kompleksitas
const WEIGHT_DEADLINE = 0.3; // Bobot tenggat waktu
const WEIGHT_ORDER_SIZE = 0.1; // Bobot ukuran pesanan

// Fungsi untuk menghitung skor tenggat waktu
const calculateDeadlineScore = (tanggal_tenggat) => {
  const daysUntilDueDate = dayjs(tanggal_tenggat).diff(dayjs(), "day");
  return daysUntilDueDate > 0 ? 1 / daysUntilDueDate : 1; // Invers dari sisa waktu
};

// Fungsi untuk menghitung skor prioritas berdasarkan rumus
const calculatePriorityScore = (urgency, complexity, deadline, orderSize) => {
  return (
    WEIGHT_URGENT * urgency +
    WEIGHT_COMPLEXITY * complexity +
    WEIGHT_DEADLINE * deadline +
    WEIGHT_ORDER_SIZE * orderSize
  );
};

// Fungsi untuk membuat jadwal produksi otomatis berdasarkan jumlah produksi
const createProductionSchedule = async (pesanan) => {
  const jadwalProduksi = new JadwalProduksi({
    id_pesanan: pesanan._id,
    jumlah_produksi: pesanan.jumlah_produksi, // Seluruh jumlah produksi
    tanggal_mulai: null, // Tanggal mulai diatur kemudian
    tanggal_selesai: null, // Tanggal selesai diatur kemudian
    status: "Menunggu",
    keterangan: pesanan.keterangan,
  });

  await jadwalProduksi.save();

  return jadwalProduksi;
};

// Create a new pesanan
exports.createPesanan = async (req, res) => {
  try {
    const {
      id_customer,
      nama_produk,
      tanggal_pesanan,
      tanggal_tenggat,
      jumlah_produksi,
      prioritas_pesanan, // Menggunakan prioritas_pesanan sebagai urgensi_pelanggan
      kompleksitas_produk, // Menambahkan kompleksitas produk
      keterangan,
    } = req.body;

    // Validasi id_customer
    if (!isValidObjectId(id_customer)) {
      return res.status(400).json({
        message: "ID customer tidak valid",
      });
    }

    // Set tanggal mulai produksi sebagai tanggal pesanan untuk contoh ini
    const tanggal_mulai_produksi = new Date();

    // Hitung tanggal estimasi selesai berdasarkan jumlah produksi dan kompleksitas produk
    const tanggal_estimasi_selesai = calculateEstimatedCompletion(
      tanggal_mulai_produksi,
      jumlah_produksi,
      kompleksitas_produk
    );

    // Hitung skor deadline (invers dari sisa waktu)
    const deadlineScore = calculateDeadlineScore(tanggal_tenggat);

    // Hitung skor prioritas menggunakan rumus
    const priorityScore = calculatePriorityScore(
      prioritas_pesanan, // Skor urgensi
      kompleksitas_produk, // Skor kompleksitas
      deadlineScore, // Skor tenggat waktu
      jumlah_produksi // Skor ukuran pesanan
    );

    const pesanan = new Pesanan({
      id_customer,
      nama_produk,
      tanggal_pesanan,
      tanggal_tenggat,
      jumlah_produksi,
      prioritas_pesanan: prioritas_pesanan, // Menyimpan skor urgensi sebagai prioritas pesanan
      nilai_prioritas: priorityScore, // Menyimpan skor prioritas di nilai_prioritas
      kompleksitas_produk,
      estimasi_selesai: tanggal_estimasi_selesai,
      keterangan,
    });

    await pesanan.save();

    // Buat satu jadwal produksi otomatis
    const jadwalProduksi = await createProductionSchedule(pesanan);

    res.status(201).json({
      message: "Pesanan berhasil dibuat dan jadwal produksi telah diatur",
      pesanan,
      jadwalProduksi,
    });
  } catch (err) {
    res.status(500).json({
      message: "Terjadi kesalahan saat membuat pesanan",
      error: err.message,
    });
  }
};

// Get all pesanan
exports.getAllPesanan = async (req, res) => {
  try {
    const pesanan = await Pesanan.find()
      .sort({ createdAt: -1 }) // Mengurutkan berdasarkan created_at
      .populate("id_customer");

    res.status(200).json({
      message: "Pesanan berhasil diambil",
      pesanan,
    });
  } catch (err) {
    res.status(500).json({
      message: "Terjadi kesalahan saat mengambil pesanan",
      error: err.message,
    });
  }
};

// Get a single pesanan by ID
exports.getPesananById = async (req, res) => {
  try {
    const pesanan = await Pesanan.findById(req.params.id).populate(
      "id_customer"
    );

    if (!pesanan) {
      return res.status(404).json({
        message: "Pesanan tidak ditemukan",
      });
    }

    res.status(200).json({
      message: "Pesanan berhasil diambil",
      pesanan,
    });
  } catch (err) {
    res.status(500).json({
      message: "Terjadi kesalahan saat mengambil pesanan",
      error: err.message,
    });
  }
};

// Update a pesanan by ID
exports.updatePesanan = async (req, res) => {
  try {
    const {
      id_customer,
      nama_produk,
      tanggal_pesanan,
      tanggal_tenggat,
      jumlah_produksi,
      prioritas_pesanan, // Skor urgensi input
      kompleksitas_produk,
      keterangan,
    } = req.body;

    // Validasi input
    if (jumlah_produksi <= 0) {
      return res.status(400).json({
        message: "Jumlah produksi harus lebih dari 0",
      });
    }

    // Cari pesanan berdasarkan ID
    const pesanan = await Pesanan.findById(req.params.id);
    if (!pesanan) {
      return res.status(404).json({
        message: "Pesanan tidak ditemukan",
      });
    }

    // Hitung ulang skor deadline
    const deadlineScore = calculateDeadlineScore(tanggal_tenggat);

    // Hitung ulang skor prioritas
    const updatedPriorityScore = calculatePriorityScore(
      prioritas_pesanan, // Skor urgensi
      kompleksitas_produk, // Skor kompleksitas
      deadlineScore, // Skor tenggat waktu
      jumlah_produksi // Skor ukuran pesanan
    );

    // Update pesanan dengan nilai baru termasuk prioritas
    const updatedPesanan = await Pesanan.findByIdAndUpdate(
      req.params.id,
      {
        id_customer,
        nama_produk,
        tanggal_pesanan,
        tanggal_tenggat,
        jumlah_produksi,
        prioritas_pesanan, // Simpan nilai urgensi di prioritas_pesanan
        nilai_prioritas: updatedPriorityScore, // Simpan skor prioritas di nilai_prioritas
        kompleksitas_produk,
        keterangan,
      },
      { new: true }
    );

    res.status(200).json({
      message: "Pesanan berhasil diperbarui",
      pesanan: updatedPesanan,
    });
  } catch (err) {
    res.status(500).json({
      message: "Terjadi kesalahan saat memperbarui pesanan",
      error: err.message,
    });
  }
};

// Delete a pesanan by ID
exports.deletePesanan = async (req, res) => {
  try {
    const pesanan = await Pesanan.findByIdAndDelete(req.params.id);

    if (!pesanan) {
      return res.status(404).json({
        message: "Pesanan tidak ditemukan",
      });
    }

    res.status(200).json({
      message: "Pesanan berhasil dihapus",
    });
  } catch (err) {
    res.status(500).json({
      message: "Terjadi kesalahan saat menghapus pesanan",
      error: err.message,
    });
  }
};
