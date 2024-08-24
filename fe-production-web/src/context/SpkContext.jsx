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

const SpkContext = createContext();

export const SpkProvider = ({ children }) => {
  const [spk, setSpk] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchSpk = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${api}/spk`);
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
      const response = await axios.get(`${api}/spk/${id}`);
      return response.data.spk;
    } catch (error) {
      toast.error("Failed to fetch SPK details");
      throw error;
    }
  };

  const updateSPKStatus = async (id, status) => {
    setLoading(true);
    try {
      const response = await axios.put(`${api}/spk/${id}`, {
        status: status,
      });
      // Update SPK data
      setSpk((prevSpk) =>
        prevSpk.map((item) => (item._id === id ? response.data.spk : item))
      );
      // Refresh data
      await fetchSpk();
      toast.success("SPK status updated successfully");
    } catch (error) {
      toast.error("Failed to update SPK status");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpk(); // Hanya memanggil fetchSpk sekali saat mount
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
