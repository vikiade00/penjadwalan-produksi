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

const CustomerContext = createContext();

export const CustomerProvider = ({ children }) => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${api}/customers`, tokenRole);
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
        tokenRole
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
        tokenRole
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
      await axios.delete(`${api}/customers/${id}`, tokenRole);
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
  }, []);

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
