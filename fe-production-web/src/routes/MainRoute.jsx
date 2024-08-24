import Layout from "@/layout/Layout";
import Dashboard from "@/pages/dashboard/Dashboard";
import Login from "@/pages/Login";
import Customer from "@/pages/user/Customer";
import User from "@/pages/user/User";
import React from "react";
import { Route, Routes } from "react-router-dom";
import Pesanan from "@/pages/pesanan/Pesanan";
import JadwalProduksi from "@/pages/jadwal/Jadwal";
import Spk from "@/pages/spk/Spk";

export default function MainRoute() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard/*" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="users" element={<User />} />
          <Route path="customers" element={<Customer />} />
          <Route path="produksi" element={<JadwalProduksi />} />
          <Route path="pesanan" element={<Pesanan />} />
          <Route path="spk" element={<Spk />} />
        </Route>
      </Routes>
    </div>
  );
}
