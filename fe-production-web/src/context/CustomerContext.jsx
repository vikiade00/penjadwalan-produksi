import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import api from "@/api/api";
import { useAuth } from "./AuthContext";

const CustomerContext = createContext();

export const CustomerProvider = ({ children }) => {
  const { user, authToken } = useAuth();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);

  const getTokenRole = () => ({
    headers: {
      Authorization: `Bearer ${authToken}`, // Gunakan authToken dari konteks
    },
  });

  const fetchCustomers = async () => {
    if (!authToken) return;

    setLoading(true);
    try {
      const response = await axios.get(`${api}/customers`, getTokenRole());
      setCustomers(response.data);
    } catch (error) {
      toast.error("Failed to fetch customers");
    } finally {
      setLoading(false);
    }
  };

  const addCustomer = async (customer) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${api}/customers`,
        customer,
        getTokenRole()
      );
      setCustomers((prevCustomers) => [...prevCustomers, response.data]);
      toast.success("Customer added successfully");
      fetchCustomers();
    } catch (error) {
      toast.error("Failed to add customer");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const updateCustomer = async (id, updatedCustomer) => {
    setLoading(true);
    try {
      const response = await axios.put(
        `${api}/customers/${id}`,
        updatedCustomer,
        getTokenRole()
      );
      setCustomers((prevCustomers) =>
        prevCustomers.map((customer) =>
          customer._id === id ? response.data : customer
        )
      );
      toast.success("Customer updated successfully");
      fetchCustomers();
    } catch (error) {
      toast.error("Failed to update customer");
    } finally {
      setLoading(false);
    }
  };

  const removeCustomer = async (id) => {
    setLoading(true);
    try {
      await axios.delete(`${api}/customers/${id}`, getTokenRole());
      setCustomers((prevCustomers) =>
        prevCustomers.filter((customer) => customer._id !== id)
      );
      toast.success("Customer removed successfully");
      fetchCustomers();
    } catch (error) {
      toast.error("Failed to remove customer");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [user, authToken]);

  return (
    <CustomerContext.Provider
      value={{
        customers,
        addCustomer,
        updateCustomer,
        removeCustomer,
        loading,
        fetchCustomers,
      }}
    >
      {children}
    </CustomerContext.Provider>
  );
};

export const useCustomer = () => {
  return useContext(CustomerContext);
};
