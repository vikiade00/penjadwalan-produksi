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
import { useAuth } from "./AuthContext";

const SpkContext = createContext();

export const SpkProvider = ({ children }) => {
  const { user, authToken } = useAuth();
  const [spk, setSpk] = useState([]);
  const [loading, setLoading] = useState(false);
  const { fetchPesanan } = usePesanan();

  const getTokenRole = useCallback(
    () => ({
      headers: {
        Authorization: `Bearer ${authToken}`, // Gunakan authToken dari konteks
      },
    }),
    [authToken]
  );

  const fetchSpk = useCallback(async () => {
    if (!authToken) return;

    setLoading(true);
    try {
      const response = await axios.get(`${api}/spk`, getTokenRole());
      setSpk(response.data.spkList || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [authToken, getTokenRole]);

  const getSpkById = useCallback(
    async (id) => {
      try {
        const response = await axios.get(`${api}/spk/${id}`, getTokenRole());
        return response.data.spk;
      } catch (error) {
        toast.error("Failed to fetch SPK details");
        throw error;
      }
    },
    [getTokenRole]
  );

  const updateSPKStatus = useCallback(
    async (id, status) => {
      setLoading(true);
      try {
        const response = await axios.put(
          `${api}/spk/${id}`,
          { status },
          getTokenRole()
        );
        const updatedSpk = response.data.spk;

        // Update SPK data locally
        setSpk((prevSpk) =>
          prevSpk.map((item) => (item._id === id ? updatedSpk : item))
        );

        toast.success("SPK status updated successfully");
        await fetchPesanan();
        await fetchSpk();
      } catch (error) {
        toast.error("Failed to update SPK status");
        console.log(error);
      } finally {
        setLoading(false);
      }
    },
    [fetchPesanan, getTokenRole]
  );

  useEffect(() => {
    fetchSpk();
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
