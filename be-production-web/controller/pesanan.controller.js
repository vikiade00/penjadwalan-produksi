const Pesanan = require("../models/pesanan");
const JadwalProduksi = require("../models/jadwalProduksi");
const mongoose = require("mongoose");
const { SPK } = require("../models/spk");

// Validasi apakah id valid
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// Fungsi untuk menghitung prioritas ROBS
const calculateROBSPriority = (tanggal_pesanan, tanggal_tenggat) => {
  const now = new Date();
  const waktu_pesanan = new Date(tanggal_pesanan);
  const tenggat_waktu = new Date(tanggal_tenggat);

  const jarak_waktu = (tenggat_waktu - now) / (1000 * 60 * 60 * 24); // Jarak waktu dalam hari
  const waktu_pesanan_diff =
    (tenggat_waktu - waktu_pesanan) / (1000 * 60 * 60 * 24); // Jarak waktu pesanan

  if (jarak_waktu <= 5) {
    return "Tinggi"; // Prioritas tinggi jika tenggat kurang dari 1 hari
  } else if (waktu_pesanan_diff < 10) {
    return "Sedang"; // Prioritas sedang jika pesanan dalam 5 hari terakhir
  } else {
    return "Rendah"; // Prioritas rendah jika lebih dari 5 hari
  }
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
      keterangan,
    } = req.body;

    // Validasi id_customer
    if (!isValidObjectId(id_customer)) {
      return res.status(400).json({
        message: "ID customer tidak valid",
      });
    }

    // Hitung prioritas pesanan menggunakan model ROBS
    const prioritas_pesanan = calculateROBSPriority(
      tanggal_pesanan,
      tanggal_tenggat
    );

    const pesanan = new Pesanan({
      id_customer,
      nama_produk,
      tanggal_pesanan,
      tanggal_tenggat,
      jumlah_produksi,
      prioritas_pesanan,
      keterangan,
    });

    await pesanan.save();

    // Buat jadwal produksi otomatis
    const jadwalProduksi = new JadwalProduksi({
      id_pesanan: pesanan._id,
      tanggal_mulai: null, // Set tanggal mulai sesuai kebutuhan
      tanggal_selesai: null, // Set tanggal selesai sesuai kebutuhan
      status: "Menunggu",
      keterangan: keterangan,
    });

    await jadwalProduksi.save();

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
      keterangan,
    } = req.body;

    // Validasi input
    if (jumlah_produksi <= 0) {
      return res.status(400).json({
        message: "Jumlah produksi harus lebih besar dari 0",
      });
    }

    // Temukan pesanan yang akan diperbarui
    const pesanan = await Pesanan.findById(req.params.id);

    if (!pesanan) {
      return res.status(404).json({
        message: "Pesanan tidak ditemukan",
      });
    }

    // Update pesanan dengan data yang baru
    pesanan.id_customer = id_customer || pesanan.id_customer;
    pesanan.nama_produk = nama_produk || pesanan.nama_produk;
    pesanan.tanggal_pesanan = tanggal_pesanan || pesanan.tanggal_pesanan;
    pesanan.tanggal_tenggat = tanggal_tenggat || pesanan.tanggal_tenggat;
    pesanan.jumlah_produksi = jumlah_produksi || pesanan.jumlah_produksi;
    pesanan.keterangan = keterangan || pesanan.keterangan;

    // Hitung prioritas pesanan menggunakan model ROBS
    pesanan.prioritas_pesanan = calculateROBSPriority(
      pesanan.tanggal_pesanan,
      pesanan.tanggal_tenggat
    );

    const updatedPesanan = await pesanan.save();

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
    // Temukan pesanan berdasarkan ID
    const pesanan = await Pesanan.findById(req.params.id);

    if (!pesanan) {
      return res.status(404).json({
        message: "Pesanan tidak ditemukan",
      });
    }

    // Temukan semua SPK yang terkait dengan pesanan ini
    const spkList = await SPK.find({ id_pesanan: pesanan._id });

    // Hapus jadwal produksi dan SPK yang terkait jika ada
    if (spkList.length > 0) {
      for (const spk of spkList) {
        if (spk.id_jadwal_produksi) {
          await JadwalProduksi.findByIdAndDelete(spk.id_jadwal_produksi);
        }
        await SPK.findByIdAndDelete(spk._id);
      }
    }

    // Hapus jadwal produksi yang terkait dengan pesanan tanpa memeriksa SPK
    await JadwalProduksi.deleteMany({ id_pesanan: pesanan._id });

    // Hapus pesanan
    await Pesanan.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Pesanan, SPK, dan jadwal produksi terkait berhasil dihapus",
    });
  } catch (err) {
    res.status(500).json({
      message: "Terjadi kesalahan saat menghapus pesanan",
      error: err.message,
    });
  }
};
