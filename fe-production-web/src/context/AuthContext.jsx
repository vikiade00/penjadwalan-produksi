import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "@/api/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(null);
  const [user, setUser] = useState({ nama: "", role: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check localStorage for auth token on initial load
    const token = localStorage.getItem("token");
    const nama = localStorage.getItem("nama");
    const role = localStorage.getItem("role");

    if (token && nama && role) {
      setAuthToken(token);
      setUser({ nama, role });
    }
  }, []);

  const login = async (username, password) => {
    setLoading(true);
    try {
      const response = await axios.post(`${api}/users/login`, {
        username,
        password,
      });
      const { token, nama, role } = response.data;

      // Save to localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("nama", nama);
      localStorage.setItem("role", role);

      // Update state
      setAuthToken(token);
      setUser({ nama, role });

      // Redirect to dashboard
      navigate("/dashboard");
    } catch (error) {
      toast.error("Username atau Password salah!");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    // Clear localStorage
    localStorage.clear();

    // Reset state
    setAuthToken(null);
    setUser({ nama: "", role: "" });

    // Redirect to login page
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
