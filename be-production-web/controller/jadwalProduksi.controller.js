const JadwalProduksi = require("../models/jadwalProduksi");
const Pesanan = require("../models/pesanan");
const mongoose = require("mongoose");
const { SPK } = require("../models/spk");

// Fungsi untuk membuat SPK
exports.createSPK = async (req, res) => {
  try {
    const { id_jadwal_produksi, tanggal_spk, keterangan } = req.body;

    const jadwalProduksi = await JadwalProduksi.findById(
      id_jadwal_produksi
    ).populate("id_pesanan");
    if (!jadwalProduksi) {
      return res.status(404).json({
        message: "Jadwal produksi tidak ditemukan",
      });
    }

    // Update status pesanan menjadi "Diproses"
    const pesanan = await Pesanan.findById(jadwalProduksi.id_pesanan._id);
    if (!pesanan) {
      return res.status(404).json({
        message: "Pesanan tidak ditemukan",
      });
    }
    pesanan.status_pesanan = "Diproses";
    await pesanan.save();

    // Update status jadwal produksi dan tanggal mulai
    jadwalProduksi.status = "Diproses";
    jadwalProduksi.tanggal_mulai = tanggal_spk; // Set tanggal mulai produksi sebagai tanggal SPK
    await jadwalProduksi.save();

    // Buat SPK
    const spk = new SPK({
      id_pesanan: jadwalProduksi.id_pesanan._id,
      id_jadwal_produksi: jadwalProduksi._id,
      tanggal_spk,
      status: "Diproses",
      keterangan,
    });

    await spk.save();

    res.status(201).json({
      message:
        "SPK berhasil dibuat dan status pesanan serta jadwal produksi diubah menjadi diproses",
      spk,
    });
  } catch (err) {
    res.status(500).json({
      message: "Terjadi kesalahan saat membuat SPK",
      error: err.message,
    });
  }
};

// Fungsi untuk mendapatkan jadwal produksi berdasarkan prioritas pesanan
exports.getJadwalProduksiByPrioritas = async (req, res) => {
  try {
    const jadwalProduksi = await JadwalProduksi.aggregate([
      {
        $lookup: {
          from: "pesanans", // Nama koleksi pesanan
          localField: "id_pesanan",
          foreignField: "_id",
          as: "pesanan",
        },
      },
      { $unwind: "$pesanan" }, // Membuka array hasil lookup
      {
        $lookup: {
          from: "customers", // Nama koleksi customer
          localField: "pesanan.id_customer",
          foreignField: "_id",
          as: "pesanan.id_customer",
        },
      },
      { $unwind: "$pesanan.id_customer" }, // Membuka array hasil lookup
      {
        $match: {
          "pesanan.status_pesanan": {
            $nin: ["Selesai", "Telat", "Dibatalkan"],
          }, // Hanya ambil pesanan yang statusnya bukan "Selesai"
        },
      },
      {
        $sort: {
          "pesanan.prioritas_pesanan": -1, // Prioritas yang lebih tinggi diutamakan (Descending order)
          "pesanan.tanggal_tenggat": 1, // Tanggal tenggat terdekat diutamakan
        },
      },
    ]);

    res.status(200).json({
      message: "Jadwal produksi berdasarkan prioritas berhasil diambil",
      jadwalProduksi,
    });
  } catch (err) {
    res.status(500).json({
      message: "Terjadi kesalahan saat mengambil jadwal produksi",
      error: err.message,
    });
  }
};

// Fungsi untuk mendapatkan data produksi per periode
exports.getProduksiPerPeriode = async (req, res) => {
  try {
    const { startDate, endDate, granularity = "day" } = req.query;

    const matchStage = {
      tanggal_mulai: { $gte: new Date(startDate) },
      tanggal_selesai: { $lte: new Date(endDate) },
    };

    const groupBy = (() => {
      switch (granularity) {
        case "day":
          return {
            year: { $year: "$tanggal_mulai" },
            month: { $month: "$tanggal_mulai" },
            day: { $dayOfMonth: "$tanggal_mulai" },
          };
        case "week":
          return {
            year: { $year: "$tanggal_mulai" },
            week: { $isoWeek: "$tanggal_mulai" },
          };
        case "month":
          return {
            year: { $year: "$tanggal_mulai" },
            month: { $month: "$tanggal_mulai" },
          };
        default:
          throw new Error("Granularity not supported");
      }
    })();

    const data = await JadwalProduksi.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: groupBy,
          totalProduksi: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    res.status(200).json({
      message: "Data produksi per periode berhasil diambil",
      data,
    });
  } catch (err) {
    res.status(500).json({
      message: "Terjadi kesalahan saat mengambil data produksi",
      error: err.message,
    });
  }
};
