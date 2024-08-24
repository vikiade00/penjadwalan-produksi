import dayjs from "dayjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableCaption,
  TableHeader,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { useUser } from "@/context/UserContext";
import Loader from "@/components/ui/Loader";
import { Toaster } from "react-hot-toast";

function User() {
  const { users, addUser, updateUser, removeUser, loading, fetchUsers } =
    useUser();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState("add");
  const [editingUser, setEditingUser] = useState(null);
  const [newUser, setNewUser] = useState({
    nama: "",
    username: "",
    role: "",
    password: "",
  });
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const handleEditClick = (user) => {
    setEditingUser(user);
    setNewUser({
      nama: user.nama,
      username: user.username,
      role: user.role,
      password: "",
    });
    setDialogMode("edit");
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setIsDeleteDialogOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (dialogMode === "add") {
      await addUser(newUser);
    } else {
      await updateUser(editingUser._id, newUser);
    }
    setIsDialogOpen(false);
    setNewUser({
      nama: "",
      username: "",
      role: "",
      password: "",
    });
    setEditingUser(null);
    fetchUsers();
  };

  const handleDeleteConfirm = async () => {
    if (userToDelete) {
      await removeUser(userToDelete._id);
      setIsDeleteDialogOpen(false);
      setUserToDelete(null);
      fetchUsers();
    }
  };

  const formatDate = (dateString) => {
    return dayjs(dateString).format("DD/MM/YYYY");
  };

  return (
    <div>
      <Toaster />
      <div className="text-2xl font-semibold">Manajemen Pengguna</div>
      <div className="flex justify-between items-center w-full my-5">
        <Input className="w-[30%]" placeholder="search" />

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger>
            <Button
              onClick={() => {
                setDialogMode("add");
                setNewUser({
                  nama: "",
                  username: "",
                  role: "admin",
                  password: "",
                });
                setIsDialogOpen(true);
              }}
            >
              Tambah
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {dialogMode === "add"
                  ? "Tambah Data Pengguna"
                  : "Edit Data Pengguna"}
              </DialogTitle>
              <DialogDescription>
                <form className="mt-5" onSubmit={handleSubmit}>
                  <Label>Nama</Label>
                  <Input
                    className="my-3"
                    value={newUser.nama}
                    onChange={(e) =>
                      setNewUser({ ...newUser, nama: e.target.value })
                    }
                    required
                  />
                  <Label>Username</Label>
                  <Input
                    className="my-3"
                    value={newUser.username}
                    onChange={(e) =>
                      setNewUser({ ...newUser, username: e.target.value })
                    }
                    required
                  />
                  <Label>Role</Label>
                  <select
                    className="my-3 border rounded w-full p-2"
                    value={newUser.role}
                    onChange={(e) =>
                      setNewUser({ ...newUser, role: e.target.value })
                    }
                    required
                  >
                    <option value="admin">Admin</option>
                    <option value="produksi">Produksi</option>
                    <option value="gudang">Gudang</option>
                  </select>
                  <Label>Password</Label>
                  <Input
                    type="password"
                    className="my-3"
                    value={newUser.password}
                    onChange={(e) =>
                      setNewUser({ ...newUser, password: e.target.value })
                    }
                    required
                  />
                  <Button className="my-3" type="submit">
                    {dialogMode === "add" ? "Kirim" : "Update"}
                  </Button>
                </form>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>

        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Konfirmasi Penghapusan</DialogTitle>
              <DialogDescription>
                <p>
                  Apakah Anda yakin ingin menghapus pengguna{" "}
                  {userToDelete?.nama}?
                </p>
                <div className="flex justify-end gap-2 mt-4">
                  <Button
                    variant="outline"
                    onClick={() => setIsDeleteDialogOpen(false)}
                  >
                    Batal
                  </Button>
                  <Button onClick={handleDeleteConfirm}>Hapus</Button>
                </div>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <Loader />
      ) : (
        <Table className="border overflow-auto">
          <TableCaption>Data Pengguna</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>No</TableHead>
              <TableHead>Nama</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Tanggal Bergabung</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((item, index) => (
              <TableRow key={item._id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{item.nama}</TableCell>
                <TableCell>{item.username}</TableCell>
                <TableCell>{item.role}</TableCell>
                <TableCell>{formatDate(item.createdAt)}</TableCell>
                <TableCell>
                  <div className="flex">
                    <Button
                      className="mr-2 bg-yellow-400"
                      onClick={() => handleEditClick(item)}
                    >
                      Edit
                    </Button>
                    <Button
                      className="bg-red-500"
                      onClick={() => handleDeleteClick(item)}
                    >
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

export default User;
