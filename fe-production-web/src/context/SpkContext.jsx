import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import api from "@/api/api";
import { usePesanan } from "./PesananContext";

const token = localStorage.getItem("token");
export const tokenRole = {
  headers: {
    Authorization: `Bearer ${token}`,
  },
};

const SpkContext = createContext();

export const SpkProvider = ({ children }) => {
  const [spk, setSpk] = useState([]);
  const [loading, setLoading] = useState(false);
  const { fetchPesanan } = usePesanan();

  const fetchSpk = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${api}/spk`, tokenRole);
      setSpk(response.data.spkList || []);
    } catch (error) {
      toast.error("Failed to fetch SPK");
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, []);

  const getSpkById = async (id) => {
    try {
      const response = await axios.get(`${api}/spk/${id}`, tokenRole);
      return response.data.spk;
    } catch (error) {
      toast.error("Failed to fetch SPK details");
      throw error;
    }
  };

  const updateSPKStatus = async (id, status) => {
    setLoading(true);
    try {
      const response = await axios.put(
        `${api}/spk/${id}`,
        { status },
        tokenRole
      );
      const updatedSpk = response.data.spk;

      // Update SPK data locally
      setSpk((prevSpk) =>
        prevSpk.map((item) => (item._id === id ? updatedSpk : item))
      );

      toast.success("SPK status updated successfully");
      fetchPesanan(); // Optionally refresh Pesanan data
    } catch (error) {
      toast.error("Failed to update SPK status");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpk();
    fetchPesanan();
  }, [fetchSpk]);

  return (
    <SpkContext.Provider
      value={{
        spk,
        loading,
        fetchSpk,
        getSpkById,
        updateSPKStatus,
      }}
    >
      {children}
    </SpkContext.Provider>
  );
};

export const useSpk = () => useContext(SpkContext);
