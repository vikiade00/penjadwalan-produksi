import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import api from "@/api/api";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${api}/users`);
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
      const response = await axios.post(`${api}/users`, user);
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
      const response = await axios.put(`${api}/users/${id}`, updatedUser);
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
      await axios.delete(`${api}/users/${id}`);
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
    fetchUsers();
  }, []);

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
