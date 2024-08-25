import React from "react";
import {
  Anvil,
  Calculator,
  CircleUser,
  Hammer,
  Home,
  LogOut,
  Menu,
  Package,
  Pickaxe,
  Search,
  ShoppingCart,
  Timer,
  UserRoundCog,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import logo from "../assets/img/logo-hitam-tanpa-nama.png";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

// Define user roles and their access
const rolesAccess = {
  admin: ["dashboard", "customers", "pesanan", "produksi", "spk"],
  pemilik: ["dashboard", "users", "customers", "pesanan", "produksi", "spk"],
  produksi: ["dashboard", "produksi", "spk"],
};

function Layout() {
  const { logout } = useAuth();

  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  const userName = localStorage.getItem("nama") || "User";
  const userRole = localStorage.getItem("role") || "";

  const accessibleRoutes = rolesAccess[userRole] || [];

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block w-56">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link
              to="/dashboard"
              className="flex items-center gap-2 font-semibold"
            >
              <img src={logo} alt="logo konveksi" width={40} />
              <span>Tumini Konveksi</span>
            </Link>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              <h1 className="text-lg font-semibold ml-3 mb-2">Dashboard</h1>
              <Link
                to="/dashboard"
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                  isActive("/dashboard")
                    ? "bg-muted text-primary"
                    : "text-muted-foreground hover:text-primary"
                }`}
              >
                <Home className="h-4 w-4" />
                Dashboard
              </Link>

              {accessibleRoutes.includes("users") && (
                <>
                  <h1 className="text-lg font-semibold ml-3 mt-2 mb-2">
                    Users
                  </h1>
                  <Link
                    to="/dashboard/users"
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                      isActive("/dashboard/users")
                        ? "bg-muted text-primary"
                        : "text-muted-foreground hover:text-primary"
                    }`}
                  >
                    <UserRoundCog className="h-4 w-4" />
                    Users
                  </Link>
                </>
              )}
              {accessibleRoutes.includes("customers") && (
                <>
                  {userRole === "admin" && (
                    <h1 className="text-lg font-semibold ml-3 mt-2 mb-2">
                      Users
                    </h1>
                  )}
                  <Link
                    to="/dashboard/customers"
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                      isActive("/dashboard/customers")
                        ? "bg-muted text-primary"
                        : "text-muted-foreground hover:text-primary"
                    }`}
                  >
                    <Users className="h-4 w-4" />
                    Customers
                  </Link>
                </>
              )}

              {accessibleRoutes.includes("pesanan") && (
                <>
                  <h1 className="text-lg font-semibold ml-3 mt-2 mb-2">
                    Produksi
                  </h1>
                  <Link
                    to="/dashboard/pesanan"
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                      isActive("/dashboard/pesanan")
                        ? "bg-muted text-primary"
                        : "text-muted-foreground hover:text-primary"
                    }`}
                  >
                    <ShoppingCart className="h-4 w-4" />
                    Pesanan
                  </Link>
                </>
              )}
              {accessibleRoutes.includes("produksi") && (
                <Link
                  to="/dashboard/produksi"
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                    isActive("/dashboard/produksi")
                      ? "bg-muted text-primary"
                      : "text-muted-foreground hover:text-primary"
                  }`}
                >
                  <Timer className="h-4 w-4" />
                  Jadwal Produksi
                </Link>
              )}
              {accessibleRoutes.includes("spk") && (
                <Link
                  to="/dashboard/spk"
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                    isActive("/dashboard/spk")
                      ? "bg-muted text-primary"
                      : "text-muted-foreground hover:text-primary"
                  }`}
                >
                  <Hammer className="h-4 w-4" />
                  SPK
                </Link>
              )}
              <div className="mt-10">
                <Link
                  to="/"
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                    isActive("/logout")
                      ? "bg-muted text-primary"
                      : "text-muted-foreground hover:text-primary"
                  }`}
                >
                  <LogOut className="h-4 w-4" />
                  <button onClick={logout}>Logout</button>
                </Link>
              </div>
            </nav>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 md:ms-5 border-b lg:ms-[-56px] bg-muted/40 px-4 lg:h-[60px]">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                <h1 className="text-lg font-semibold ml-3">Dashboard</h1>
                <Link
                  to="/dashboard"
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                    isActive("/dashboard")
                      ? "bg-muted text-primary"
                      : "text-muted-foreground hover:text-primary"
                  }`}
                >
                  <Home className="h-4 w-4" />
                  Dashboard
                </Link>

                {accessibleRoutes.includes("users") && (
                  <>
                    <h1 className="text-lg font-semibold ml-3 mt-3">Users</h1>
                    <Link
                      to="/dashboard/users"
                      className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                        isActive("/dashboard/users")
                          ? "bg-muted text-primary"
                          : "text-muted-foreground hover:text-primary"
                      }`}
                    >
                      <UserRoundCog className="h-4 w-4" />
                      Users
                    </Link>
                  </>
                )}
                {accessibleRoutes.includes("customers") && (
                  <Link
                    to="/dashboard/customers"
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                      isActive("/dashboard/customers")
                        ? "bg-muted text-primary"
                        : "text-muted-foreground hover:text-primary"
                    }`}
                  >
                    <Users className="h-4 w-4" />
                    Customers
                  </Link>
                )}

                {accessibleRoutes.includes("pesanan") && (
                  <>
                    <h1 className="text-lg font-semibold ml-3 mt-3">
                      Produksi
                    </h1>
                    <Link
                      to="/dashboard/pesanan"
                      className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                        isActive("/dashboard/pesanan")
                          ? "bg-muted text-primary"
                          : "text-muted-foreground hover:text-primary"
                      }`}
                    >
                      <Pickaxe className="h-4 w-4" />
                      Produksi
                    </Link>
                  </>
                )}
                {accessibleRoutes.includes("produksi") && (
                  <Link
                    to="/dashboard/produksi"
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                      isActive("/dashboard/produksi")
                        ? "bg-muted text-primary"
                        : "text-muted-foreground hover:text-primary"
                    }`}
                  >
                    <Timer className="h-4 w-4" />
                    Jadwal Produksi
                  </Link>
                )}
                {accessibleRoutes.includes("spk") && (
                  <Link
                    to="/dashboard/spk"
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                      isActive("/dashboard/spk")
                        ? "bg-muted text-primary"
                        : "text-muted-foreground hover:text-primary"
                    }`}
                  >
                    <Hammer className="h-4 w-4" />
                    SPK
                  </Link>
                )}

                {accessibleRoutes.includes("produk") && (
                  <>
                    <h1 className="text-lg font-semibold ml-3 mt-3">Produk</h1>
                    <Link
                      to="/dashboard/produk"
                      className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                        isActive("/dashboard/produk")
                          ? "bg-muted text-primary"
                          : "text-muted-foreground hover:text-primary"
                      }`}
                    >
                      <Package className="h-4 w-4" />
                      Produk
                    </Link>
                  </>
                )}
                {accessibleRoutes.includes("bahan") && (
                  <Link
                    to="/dashboard/bahan"
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                      isActive("/dashboard/bahan")
                        ? "bg-muted text-primary"
                        : "text-muted-foreground hover:text-primary"
                    }`}
                  >
                    <Anvil className="h-4 w-4" />
                    Bahan
                  </Link>
                )}
                {accessibleRoutes.includes("kalkulasi") && (
                  <Link
                    to="/dashboard/kalkulasi"
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                      isActive("/dashboard/kalkulasi")
                        ? "bg-muted text-primary"
                        : "text-muted-foreground hover:text-primary"
                    }`}
                  >
                    <Calculator className="h-4 w-4" />
                    Kalkulasi Bahan
                  </Link>
                )}
              </nav>
            </SheetContent>
          </Sheet>
          <div className="w-full flex-1">
            <form>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search products..."
                  className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
                />
              </div>
            </form>
          </div>
          <div className="flex items-center gap-2">
            <div>
              Hallo, <b>{userName}</b>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <CircleUser className="h-5 w-5" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuItem>
                <button onClick={logout}>Logout</button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="flex flex-1 ms-7 md:ms-6 flex-col gap-4 p-4 max-w-sm md:max-w-full lg:gap lg:p-6 lg:ms-[-40px]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;
