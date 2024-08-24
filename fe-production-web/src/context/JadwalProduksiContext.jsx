import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import api from "@/api/api";

const JadwalProduksiContext = createContext();

export const JadwalProduksiProvider = ({ children }) => {
  const [jadwalProduksi, setJadwalProduksi] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchJadwalProduksiByPrioritas = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${api}/jadwal/prioritas`);
      setJadwalProduksi(response.data.jadwalProduksi || []);
    } catch (error) {
      toast.error("Failed to fetch jadwal produksi");
    } finally {
      setLoading(false);
    }
  };

  const createSPK = async (newSPK) => {
    try {
      await axios.post(`${api}/jadwal/spk`, newSPK);
      toast.success("SPK created successfully");
      fetchJadwalProduksiByPrioritas();
    } catch (error) {
      toast.error("Failed to create SPK");
      console.log(error);
    }
  };

  const updateJadwalProduksi = async (id, updatedData) => {
    try {
      await axios.put(`${api}/jadwal/${id}`, updatedData);
      toast.success("Jadwal Produksi updated successfully");
      fetchJadwalProduksiByPrioritas();
    } catch (error) {
      toast.error("Failed to update Jadwal Produksi");
    }
  };

  useEffect(() => {
    fetchJadwalProduksiByPrioritas();
  }, []);

  return (
    <JadwalProduksiContext.Provider
      value={{
        jadwalProduksi,
        fetchJadwalProduksiByPrioritas,
        createSPK,
        updateJadwalProduksi,
        loading,
      }}
    >
      {children}
    </JadwalProduksiContext.Provider>
  );
};

export const useJadwalProduksi = () => useContext(JadwalProduksiContext);
