const Customer = require("../models/customer");
const dayjs = require("dayjs");
const Pesanan = require("../models/pesanan");
const JadwalProduksi = require("../models/jadwalProduksi");

const cetakController = {
  // Cetak semua periode
  async cetakSemuaPeriode(req, res) {
    try {
      const pesananData = await Pesanan.find()
        .populate("id_customer", "nama")
        .lean();
      const hasilCetak = await formatHasilCetak(pesananData);
      res.json(hasilCetak);
    } catch (error) {
      console.error("Gagal mencetak data:", error);
      res.status(500).json({ message: "Gagal mencetak data" });
    }
  },

  // Cetak berdasarkan hari
  async cetakHarian(req, res) {
    const { date } = req.query;
    const targetDate = dayjs(date).startOf("day").toDate();
    const nextDay = dayjs(date).add(1, "day").startOf("day").toDate();

    try {
      const pesananData = await Pesanan.find({
        tanggal_pesanan: { $gte: targetDate, $lt: nextDay },
      })
        .populate("id_customer", "nama")
        .lean();
      const hasilCetak = await formatHasilCetak(pesananData);
      res.json(hasilCetak);
    } catch (error) {
      console.error("Gagal mencetak data:", error);
      res.status(500).json({ message: "Gagal mencetak data" });
    }
  },

  // Cetak berdasarkan mingguan
  async cetakMingguan(req, res) {
    const { date } = req.query;
    const startOfWeek = dayjs(date).startOf("week").toDate();
    const endOfWeek = dayjs(date).endOf("week").toDate();

    try {
      const pesananData = await Pesanan.find({
        tanggal_pesanan: { $gte: startOfWeek, $lt: endOfWeek },
      })
        .populate("id_customer", "nama")
        .lean();
      const hasilCetak = await formatHasilCetak(pesananData);
      res.json(hasilCetak);
    } catch (error) {
      console.error("Gagal mencetak data:", error);
      res.status(500).json({ message: "Gagal mencetak data" });
    }
  },

  // Cetak berdasarkan tahunan
  async cetakTahunan(req, res) {
    const { year } = req.query;
    const startOfYear = dayjs(`${year}-01-01`).startOf("year").toDate();
    const endOfYear = dayjs(`${year}-12-31`).endOf("year").toDate();

    try {
      const pesananData = await Pesanan.find({
        tanggal_pesanan: { $gte: startOfYear, $lt: endOfYear },
      })
        .populate("id_customer", "nama")
        .lean();
      const hasilCetak = await formatHasilCetak(pesananData);
      res.json(hasilCetak);
    } catch (error) {
      console.error("Gagal mencetak data:", error);
      res.status(500).json({ message: "Gagal mencetak data" });
    }
  },

  // Cetak berdasarkan status
  async cetakBerdasarkanStatus(req, res) {
    const { status } = req.query;

    try {
      const pesananData = await Pesanan.find({
        status_pesanan: status,
      })
        .populate("id_customer", "nama")
        .lean();
      const hasilCetak = await formatHasilCetak(pesananData);
      res.json(hasilCetak);
    } catch (error) {
      console.error("Gagal mencetak data:", error);
      res.status(500).json({ message: "Gagal mencetak data" });
    }
  },
};

// Fungsi untuk memformat hasil cetakan
async function formatHasilCetak(pesananData) {
  return await Promise.all(
    pesananData.map(async (pesanan) => {
      const jadwalProduksi = await JadwalProduksi.findOne({
        id_pesanan: pesanan._id,
      }).lean();

      return {
        kode_pesanan: pesanan.kode_pesanan,
        nama_customer: pesanan.id_customer.nama,
        nama_produk: pesanan.nama_produk,
        jumlah_produk: pesanan.jumlah_produksi,
        tanggal_tenggat: pesanan.tanggal_tenggat,
        tanggal_mulai: jadwalProduksi?.tanggal_mulai || "Belum dimulai",
        tanggal_selesai: jadwalProduksi?.tanggal_selesai || "Belum selesai",
        status: pesanan.status_pesanan,
        prioritas: pesanan.prioritas_pesanan,
      };
    })
  );
}

module.exports = cetakController;
