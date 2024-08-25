import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import api from "@/api/api";

const token = localStorage.getItem("token");
export const tokenRole = {
  headers: {
    Authorization: `Bearer ${token}`,
  },
};

const PesananContext = createContext();

export const PesananProvider = ({ children }) => {
  const [pesanan, setPesanan] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPesanan = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${api}/pesanan`, tokenRole);
      setPesanan(response.data.pesanan);
    } catch (error) {
      toast.error("Gagal memuat pesanan");
      console.error("Error fetching pesanan:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomers = async () => {
    try {
      const response = await axios.get(`${api}/customers`, tokenRole);
      setCustomers(response.data);
    } catch (error) {
      toast.error("Gagal memuat customer");
      console.error("Error fetching customers:", error);
    }
  };

  const addPesanan = async (pesanan) => {
    setLoading(true);
    try {
      const response = await axios.post(`${api}/pesanan`, pesanan, tokenRole);
      setPesanan((prevPesanan) => [...prevPesanan, response.data]);
      toast.success("Pesanan berhasil ditambahkan");
    } catch (error) {
      toast.error("Gagal menambahkan pesanan");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const updatePesanan = async (id, updatedPesanan) => {
    setLoading(true);
    try {
      const response = await axios.put(
        `${api}/pesanan/${id}`,
        updatedPesanan,
        tokenRole
      );
      setPesanan((prevPesanan) =>
        prevPesanan.map((pesanan) =>
          pesanan._id === id ? response.data : pesanan
        )
      );
      toast.success("Pesanan berhasil diperbarui");
    } catch (error) {
      toast.error("Gagal memperbarui pesanan");
    } finally {
      setLoading(false);
    }
  };

  const removePesanan = async (id) => {
    setLoading(true);
    try {
      await axios.delete(`${api}/pesanan/${id}`, tokenRole);
      setPesanan((prevPesanan) =>
        prevPesanan.filter((pesanan) => pesanan._id !== id)
      );
      toast.success("Pesanan berhasil dihapus");
    } catch (error) {
      toast.error("Gagal menghapus pesanan");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
    fetchPesanan();
  }, []);

  return (
    <PesananContext.Provider
      value={{
        pesanan,
        addPesanan,
        updatePesanan,
        removePesanan,
        loading,
        fetchPesanan,
        customers,
        products,
      }}
    >
      {children}
    </PesananContext.Provider>
  );
};

export const usePesanan = () => useContext(PesananContext);
