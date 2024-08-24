import React, { forwardRef, useImperativeHandle, useRef } from "react";

const CetakLaporan = forwardRef(({ data }, ref) => {
  const printContentRef = useRef();

  const formatDate = (date) => new Date(date).toLocaleDateString("id-ID");
  const printData = data || [];

  useImperativeHandle(ref, () => ({
    print() {
      if (printContentRef.current) {
        const printWindow = window.open("", "");
        printWindow.document.open();
        printWindow.document.write("<html><head><title>Print</title>");
        printWindow.document.write(
          "<style>body { font-family: Arial, sans-serif; } table { width: 100%; border-collapse: collapse; } th, td { border: 1px solid #ddd; padding: 8px; } th { background-color: #f4f4f4; }</style>"
        );
        printWindow.document.write("</head><body>");
        printWindow.document.write(printContentRef.current.innerHTML);
        printWindow.document.write("</body></html>");
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
      }
    },
  }));

  return (
    <div ref={printContentRef} className="">
      <h2>Laporan Produksi Cek</h2>
      <table>
        <thead>
          <tr>
            <th>Kode Pesanan</th>
            <th>Nama Customer</th>
            <th>Nama Produk</th>
            <th>Jumlah Produk</th>
            <th>Tanggal Tenggat</th>
            <th>Tanggal Mulai</th>
            <th>Tanggal Selesai</th>
            <th>Status</th>
            <th>Prioritas</th>
          </tr>
        </thead>
        <tbody>
          {printData.map((item, index) => (
            <tr key={index}>
              <td>{item.kode_pesanan}</td>
              <td>{item.nama_customer}</td>
              <td>{item.nama_produk}</td>
              <td>{item.jumlah_produk}</td>
              <td>{formatDate(item.tanggal_tenggat)}</td>
              <td>
                {item.tanggal_mulai === "Belum dimulai"
                  ? "Belum Dimulai"
                  : formatDate(item.tanggal_mulai)}
              </td>
              <td>
                {item.tanggal_selesai === "Belum selesai"
                  ? "Belum Selesai"
                  : formatDate(item.tanggal_selesai)}
              </td>
              <td>{item.status}</td>
              <td>{item.prioritas}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});

CetakLaporan.displayName = "CetakLaporan";

export default CetakLaporan;
