const JadwalProduksi = require("../models/jadwalProduksi");
const Pesanan = require("../models/pesanan");
const Customer = require("../models/customer");
const dayjs = require("dayjs");
const { SPK } = require("../models/spk");

// Fungsi untuk mengupdate status SPK
exports.updateSPKStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const spk = await SPK.findById(req.params.id);

    if (!spk) {
      return res.status(404).json({
        message: "SPK tidak ditemukan",
      });
    }

    // Update status SPK
    spk.status = status || spk.status;

    // Simpan perubahan SPK
    const updatedSPK = await spk.save();

    // Update status pesanan dan jadwal produksi jika SPK diperbarui
    const pesanan = await Pesanan.findById(spk.id_pesanan);
    const jadwalProduksi = await JadwalProduksi.findById(
      spk.id_jadwal_produksi
    );

    if (!pesanan || !jadwalProduksi) {
      return res.status(404).json({
        message: "Pesanan atau Jadwal Produksi tidak ditemukan",
      });
    }

    // Update status pesanan dan jadwal produksi
    pesanan.status_pesanan = status;
    jadwalProduksi.status = status;

    const tanggalSelesai = dayjs().startOf("day"); // Mengabaikan waktu, hanya mempertimbangkan tanggal

    if (tanggalSelesai.isAfter(dayjs(pesanan.tanggal_tenggat).startOf("day"))) {
      jadwalProduksi.status = "Telat";
      jadwalProduksi.tanggal_selesai = tanggalSelesai.format("YYYY-MM-DD");
    } else {
      jadwalProduksi.status = "Selesai"; // Status tetap selesai jika tidak melebihi atau sama dengan tenggat
      jadwalProduksi.tanggal_selesai = tanggalSelesai.format("YYYY-MM-DD");
    }

    await pesanan.save();
    await jadwalProduksi.save();

    res.status(200).json({
      message: "Status SPK, Pesanan, dan Jadwal Produksi berhasil diperbarui",
      spk: updatedSPK,
    });
  } catch (err) {
    res.status(500).json({
      message: "Terjadi kesalahan saat memperbarui status SPK",
      error: err.message,
    });
  }
};

// Fungsi untuk mendapatkan SPK berdasarkan ID
exports.getSPKById = async (req, res) => {
  try {
    const spk = await SPK.findById(req.params.id)
      .populate("id_pesanan")
      .populate("id_jadwal_produksi");

    if (!spk) {
      return res.status(404).json({
        message: "SPK tidak ditemukan",
      });
    }

    res.status(200).json({
      message: "SPK berhasil diambil",
      spk,
    });
  } catch (err) {
    res.status(500).json({
      message: "Terjadi kesalahan saat mengambil SPK",
      error: err.message,
    });
  }
};

// Fungsi untuk mendapatkan semua SPK
exports.getAllSPK = async (req, res) => {
  try {
    const spkList = await SPK.find()
      .populate({
        path: "id_pesanan",
        populate: [{ path: "id_customer" }],
      })
      .populate("id_jadwal_produksi")
      .sort({ createdAt: -1 }); // Mengurutkan berdasarkan waktu terbaru

    const spkListWithDetails = spkList.map((spk) => {
      const { id_pesanan, id_jadwal_produksi, ...restSPK } = spk.toObject();

      return {
        ...restSPK,
        id_pesanan: id_pesanan
          ? {
              _id: id_pesanan._id,
              kode_pesanan: id_pesanan.kode_pesanan,
              nama_customer: id_pesanan.id_customer?.nama || "Tidak ada",
              nama_produk: id_pesanan.nama_produk || "Tidak ada",
              tanggal_tenggat: id_pesanan.tanggal_tenggat,
              jumlah_produksi: id_pesanan.jumlah_produksi,
              prioritas_pesanan: id_pesanan.prioritas_pesanan,
            }
          : null,
        id_jadwal_produksi: id_jadwal_produksi
          ? {
              _id: id_jadwal_produksi._id,
              tanggal_mulai: id_jadwal_produksi.tanggal_mulai,
              tanggal_selesai: id_jadwal_produksi.tanggal_selesai,
              status: id_jadwal_produksi.status,
              keterangan: id_jadwal_produksi.keterangan,
            }
          : null,
      };
    });

    res.status(200).json({
      message: "Daftar semua SPK berhasil diambil",
      spkList: spkListWithDetails,
    });
  } catch (err) {
    res.status(500).json({
      message: "Terjadi kesalahan saat mengambil daftar SPK",
      error: err.message,
    });
  }
};
