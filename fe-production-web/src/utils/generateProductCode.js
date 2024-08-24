function generateProductCode(mongoId) {
  // Ambil beberapa karakter dari ID MongoDB sebagai contoh
  const idPart = mongoId.substring(0, 7);
  // Konversi ID ke angka dan ambil modulus 1000
  const codeNumber = parseInt(idPart, 16) % 1000;
  // Format kode produk
  return `PR-${String(codeNumber).padStart(4, "0")}`;
}

export default generateProductCode;
