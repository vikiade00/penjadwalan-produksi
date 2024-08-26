import React, { createContext, useState, useContext } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import api from "@/api/api";
import { useAuth } from "./AuthContext";

const PrintContext = createContext();

export const PrintProvider = ({ children }) => {
  const { authToken } = useAuth();
  const [loading, setLoading] = useState(false);

  const getTokenRole = () => ({
    headers: {
      Authorization: `Bearer ${authToken}`, // Gunakan authToken dari konteks
    },
  });

  const cetak = async (type, params = {}) => {
    setLoading(true);
    try {
      let url = `${api}/cetak/${type}`;
      if (Object.keys(params).length > 0) {
        url += `?${new URLSearchParams(params).toString()}`;
      }
      const response = await axios.get(url, getTokenRole(), {
        responseType: "json",
      });
      const data = response.data;

      // Open a new tab for printing
      const newWindow = window.open("", "_blank");
      newWindow.document.open();
      newWindow.document.write("<html><head><title>Laporan Produksi</title>");
      newWindow.document.write(
        "<style>body { font-family: Arial, sans-serif; margin: 0; padding: 0; } table { width: 100%; border-collapse: collapse; } th, td { border: 1px solid #ddd; padding: 8px; } th { background-color: #f4f4f4; } .header { text-align: center; margin-bottom: 20px; } .logo { width: 100px; } </style>"
      );
      newWindow.document.write("</head><body>");

      // Add letterhead
      newWindow.document.write(`
        <div class="header">
          <h1>Tumini Konveksi</h1>
          <p>Jl.Kopo Kel.Margasuka Kec.Babakan Ciparay, Kota Bandung - 40225, Jawa Barat</p>
          <p>Telepon: 0898898273123 | Email: tuminikonveksi@gmail.com</p>
          <hr />
        </div>
      `);

      // Add report title
      newWindow.document.write("<h2>Laporan Produksi</h2>");
      newWindow.document.write("<table>");
      newWindow.document.write(
        "<thead><tr><th>Kode Pesanan</th><th>Nama Customer</th><th>Nama Produk</th><th>Jumlah Produk</th><th>Tanggal Tenggat</th><th>Tanggal Mulai</th><th>Tanggal Selesai</th><th>Status</th><th>Prioritas</th></tr></thead><tbody>"
      );
      data.forEach((item) => {
        newWindow.document.write(`<tr>
          <td>${item.kode_pesanan}</td>
          <td>${item.nama_customer}</td>
          <td>${item.nama_produk}</td>
          <td>${item.jumlah_produk}</td>
          <td>${new Date(item.tanggal_tenggat).toLocaleDateString("id-ID")}</td>
          <td>${
            item.tanggal_mulai === "Belum dimulai"
              ? "Belum Dimulai"
              : new Date(item.tanggal_mulai).toLocaleDateString("id-ID")
          }</td>
          <td>${
            item.tanggal_selesai === "Belum selesai"
              ? "Belum Selesai"
              : new Date(item.tanggal_selesai).toLocaleDateString("id-ID")
          }</td>
          <td>${item.status}</td>
          <td>${item.prioritas}</td>
        </tr>`);
      });
      newWindow.document.write("</tbody></table>");
      newWindow.document.write("</body></html>");
      newWindow.document.close();

      // Ensure the window is fully loaded before printing
      newWindow.onload = () => {
        newWindow.focus();
        newWindow.print();
      };

      // Reset loading state as soon as the new tab is opened
      setLoading(false);
    } catch (error) {
      toast.error("Gagal mencetak!");
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <PrintContext.Provider value={{ cetak, loading }}>
      {children}
    </PrintContext.Provider>
  );
};

export const usePrint = () => useContext(PrintContext);
