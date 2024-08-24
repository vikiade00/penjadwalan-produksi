import React, { createContext, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "@/api/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(
    localStorage.getItem("token") || null
  );
  const [user, setUser] = useState({
    nama: localStorage.getItem("nama"),
    role: localStorage.getItem("role"),
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const login = async (username, password) => {
    setLoading(true);
    try {
      const response = await axios.post(`${api}/users/login`, {
        username,
        password,
      });
      const { token, nama, role } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("nama", nama);
      localStorage.setItem("role", role);
      setAuthToken(token);
      setUser({ nama, role });
      navigate("/dashboard");
      return { token, nama, role };
    } catch (error) {
      toast.error("Username Atau Password Salah!");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("nama");
    localStorage.removeItem("role");
    setAuthToken(null);
    setUser(null);
    navigate("/");
  };

  return (
    <AuthContext.Provider value={{ authToken, user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
