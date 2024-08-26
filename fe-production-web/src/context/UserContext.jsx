import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import api from "@/api/api";
import { useAuth } from "./AuthContext";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const { user, authToken } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const getTokenRole = () => ({
    headers: {
      Authorization: `Bearer ${authToken}`, // Gunakan authToken dari konteks
    },
  });

  const fetchUsers = async () => {
    if (!authToken) return;

    setLoading(true);
    try {
      const response = await axios.get(`${api}/users`, getTokenRole());
      setUsers(response.data);
    } catch (error) {
      toast.error("Gagal mengambil data pengguna");
    } finally {
      setLoading(false);
    }
  };

  const addUser = async (user) => {
    setLoading(true);
    try {
      const response = await axios.post(`${api}/users`, user, getTokenRole());
      setUsers((prevUsers) => [...prevUsers, response.data]);
      toast.success("Pengguna berhasil ditambahkan");
      fetchUsers();
    } catch (error) {
      toast.error("Gagal menambahkan pengguna");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (id, updatedUser) => {
    setLoading(true);
    try {
      const response = await axios.put(
        `${api}/users/${id}`,
        updatedUser,
        getTokenRole()
      );
      setUsers((prevUsers) =>
        prevUsers.map((user) => (user._id === id ? response.data : user))
      );
      toast.success("Pengguna berhasil diperbarui");
      fetchUsers();
    } catch (error) {
      toast.error("Gagal memperbarui pengguna");
    } finally {
      setLoading(false);
    }
  };

  const removeUser = async (id) => {
    setLoading(true);
    try {
      await axios.delete(`${api}/users/${id}`, getTokenRole());
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== id));
      toast.success("Pengguna berhasil dihapus");
      fetchUsers();
    } catch (error) {
      toast.error("Gagal menghapus pengguna");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const userRole = localStorage.getItem("role");
    if (userRole === "pemilik") {
      fetchUsers();
    }
  }, [user, authToken]);

  return (
    <UserContext.Provider
      value={{
        users,
        addUser,
        updateUser,
        removeUser,
        loading,
        fetchUsers,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  return useContext(UserContext);
};
