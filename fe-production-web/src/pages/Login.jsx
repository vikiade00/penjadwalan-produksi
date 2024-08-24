import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { Toaster } from "react-hot-toast";
import logo from "../assets/img/logo-hitam-tanpa-nama.png";
import { useNavigate } from "react-router-dom";
import { IMAGES } from "@/assets/img/constant";

function Login() {
  const { login, loading } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const result = await login(username, password);
      console.log("Login result:", result); // Debugging log
      if (result) {
        const { token, nama, role } = result;
        localStorage.setItem("token", token);
        localStorage.setItem("nama", nama);
        localStorage.setItem("role", role);
        navigate("/dashboard"); // Redirect to dashboard after successful login
      }
    } catch (error) {
      console.log("Login failed:", error);
    }
  };

  return (
    <div className="flex flex-wrap justify-between flex-col-reverse md:flex-row ">
      <Toaster />
      <div className="h-screen w-[100%] md:w-[50%] bg-primary flex items-center justify-center">
        <div className="flex text-gray-300  justify-center items-center flex-col p-20 text-center">
          <img src={IMAGES.logo} alt="Logo" width={200} />
          <div className="text-2xl font-bold mb-4">Tumini Konveksi</div>
          <p className="text-gray-400 italic">
            Kelola jadwal produksi, perbarui status pekerjaan, pantau kemajuan
            produksi, dan pastikan setiap tahapan berjalan sesuai rencana untuk
            mencapai target produksi yang optimal.
          </p>
        </div>
      </div>
      <div className="flex h-screen justify-center w-[100%] md:w-[50%] items-center">
        <div className="flex items-center flex-col p-10 ">
          <h1 className="text-3xl font-bold mb-1">Login</h1>
          <p className="text-balance text-muted-foreground mt-3">
            Enter your email below to login to your account
          </p>

          <form onSubmit={handleLogin} className="grid gap-4 w-full mt-10">
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Your Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                placeholder="Your Password"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              Login
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
