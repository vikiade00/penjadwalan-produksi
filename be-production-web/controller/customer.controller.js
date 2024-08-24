const { Customer } = require("../models/customer");

// Membuat customer baru
exports.createCustomer = async (req, res) => {
  const { nama, alamat, email, no_telepon, keterangan } = req.body;

  try {
    const customer = new Customer({
      nama,
      alamat,
      email,
      no_telepon,
      keterangan,
    });

    await customer.save();
    res.status(201).json({ message: "Customer berhasil dibuat", customer });
  } catch (err) {
    res.status(500).json({
      message: "Terjadi kesalahan pada server",
      error: err.message,
    });
  }
};

// Mendapatkan semua customer
exports.getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.find().sort({ updated_at: -1 });
    res.status(200).json(customers);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Terjadi kesalahan pada server", error: err.message });
  }
};

// Mendapatkan customer berdasarkan ID
exports.getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: "Customer tidak ditemukan" });
    }
    res.status(200).json(customer);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Terjadi kesalahan pada server", error: err.message });
  }
};

// Memperbarui customer berdasarkan ID
exports.updateCustomer = async (req, res) => {
  const { nama, alamat, email, no_telepon, keterangan } = req.body;

  try {
    let customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: "Customer tidak ditemukan" });
    }

    customer.nama = nama || customer.nama;
    customer.alamat = alamat || customer.alamat;
    customer.email = email || customer.email;
    customer.no_telepon = no_telepon || customer.no_telepon;
    customer.keterangan = keterangan || customer.keterangan;
    customer.updated_at = Date.now();

    await customer.save();
    res.status(200).json({ message: "Customer berhasil diperbarui", customer });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Terjadi kesalahan pada server", error: err.message });
  }
};

// Menghapus customer berdasarkan ID
exports.deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: "Customer tidak ditemukan" });
    }

    await Customer.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: "Customer berhasil dihapus" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Terjadi kesalahan pada server", error: err.message });
  }
};
