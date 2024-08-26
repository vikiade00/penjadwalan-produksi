import React, { useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";

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
import { Label } from "@/components/ui/label";
import { GlobalFilter } from "@/components/GlobalFillter";
import { useCustomer } from "@/context/CustomerContext";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import dayjs from "dayjs";
import { useAuth } from "@/context/AuthContext";
import { Toaster } from "react-hot-toast";

function Customer() {
  const { user } = useAuth();
  const {
    customers,
    addCustomer,
    updateCustomer,
    removeCustomer,
    loading,
    fetchCustomers,
  } = useCustomer();

  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState("add");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [newCustomer, setNewCustomer] = useState({
    nama: "",
    alamat: "",
    email: "",
    no_telepon: "",
    keterangan: "",
  });
  const [globalFilter, setGlobalFilter] = useState("");
  const [pagination, setPagination] = useState({
    pageIndex: 0, //initial page index
    pageSize: 5,
  });

  const handlePageSizeChange = (event) => {
    const newPageSize = Number(event.target.value);
    setPagination((prev) => ({
      ...prev,
      pageSize: newPageSize,
      pageIndex: 0,
    }));
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "kode_customer",
        header: "Kode Customer",
      },
      {
        accessorKey: "nama",
        header: "Nama",
      },
      {
        accessorKey: "alamat",
        header: "Alamat",
      },
      {
        accessorKey: "email",
        header: "Email",
      },
      {
        accessorKey: "no_telepon",
        header: "No Telepon",
      },
      {
        accessorFn: (row) => dayjs(row.tanggal_bergabung).format("DD/MM/YYYY"),
        id: "tanggal_bergabung",
        header: "Tanggal Bergabung",
      },
      {
        accessorKey: "keterangan",
        header: "Keterangan",
      },
      {
        id: "action",
        header: "Action",
        cell: ({ row }) => {
          const { user } = useAuth(); // Mengambil user dari AuthContext

          // Periksa apakah pengguna memiliki role "admin"
          if (user && user.role === "admin") {
            return (
              <div className="flex">
                <Button
                  className="mr-2 bg-yellow-400"
                  onClick={() => handleEditClick(row.original)}
                >
                  Edit
                </Button>
                <Button
                  className="bg-red-500"
                  onClick={() => handleDeleteClick(row.original)}
                >
                  Delete
                </Button>
              </div>
            );
          }

          // Jika bukan admin, jangan tampilkan apapun atau bisa tampilkan elemen kosong
          return null;
        },
      },
    ],
    []
  );

  const table = useReactTable({
    data: customers,
    columns,
    state: {
      globalFilter,
      pagination,
    },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    onPaginationChange: setPagination,
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    autoResetPageIndex: false,
  });

  const handleEditClick = (customer) => {
    setEditingCustomer(customer);
    setNewCustomer({
      nama: customer.nama,
      alamat: customer.alamat,
      email: customer.email,
      no_telepon: customer.no_telepon,
      keterangan: customer.keterangan,
    });
    setDialogMode("edit");
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (customer) => {
    setSelectedCustomer(customer);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    await removeCustomer(selectedCustomer._id);
    setIsDeleteDialogOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (dialogMode === "add") {
      await addCustomer(newCustomer);
    } else {
      await updateCustomer(editingCustomer._id, newCustomer);
    }
    setIsDialogOpen(false);
    setNewCustomer({
      nama: "",
      alamat: "",
      email: "",
      no_telepon: "",
      keterangan: "",
    });
    setEditingCustomer(null);
    fetchCustomers();
  };

  return (
    <div>
      <Toaster />
      <div className="text-2xl font-bold">Customer</div>
      <div className="flex justify-between items-center w-full my-5">
        <GlobalFilter
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
        />
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          {user.role === "admin" && (
            <Button>
              <a
                onClick={() => {
                  setDialogMode("add");
                  setNewCustomer({
                    nama: "",
                    alamat: "",
                    email: "",
                    no_telepon: "",
                    keterangan: "",
                  });
                  setIsDialogOpen(true);
                }}
              >
                Tambah
              </a>
            </Button>
          )}
          <DialogContent>
            {dialogMode === "add" ? (
              <div className="text-xl font-bold">Tambah Data Customer</div>
            ) : (
              <div className="text-xl font-bold">Edit Data Customer</div>
            )}
            <form className="mt-2 flex flex-col gap-3" onSubmit={handleSubmit}>
              <Label>Nama</Label>
              <Input
                value={newCustomer.nama}
                onChange={(e) =>
                  setNewCustomer({ ...newCustomer, nama: e.target.value })
                }
                required
                maxLength={30}
              />
              <Label>Alamat</Label>
              <Input
                value={newCustomer.alamat}
                onChange={(e) =>
                  setNewCustomer({ ...newCustomer, alamat: e.target.value })
                }
                required
                maxLength={256}
              />
              <Label>Email</Label>
              <Input
                value={newCustomer.email}
                onChange={(e) =>
                  setNewCustomer({ ...newCustomer, email: e.target.value })
                }
                required
                maxLength={50}
              />
              <Label>No Telepon</Label>
              <Input
                value={newCustomer.no_telepon}
                onChange={(e) => {
                  const value = e.target.value;
                  // Update state only if the value contains only numbers
                  if (/^\d*$/.test(value)) {
                    setNewCustomer({
                      ...newCustomer,
                      no_telepon: value,
                    });
                  }
                }}
                required
                maxLength={15}
              />
              <Label>Keterangan</Label>
              <Input
                value={newCustomer.keterangan}
                onChange={(e) =>
                  setNewCustomer({
                    ...newCustomer,
                    keterangan: e.target.value,
                  })
                }
              />
              <Button className="my-3">
                {dialogMode === "add" ? "Kirim" : "Update"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Hapus Customer</DialogTitle>
              <DialogDescription>
                <p>
                  Apakah Anda yakin ingin menghapus Customer ini? Jika Anda
                  melanjutkan, semua informasi terkait Customer ini akan dihapus
                  secara permanen.
                </p>

                <div className="flex justify-end gap-2 mt-4">
                  <Button
                    variant="outline"
                    onClick={() => setIsDeleteDialogOpen(false)}
                  >
                    Batal
                  </Button>
                  <Button variant="destructive" onClick={handleDeleteConfirm}>
                    Hapus
                  </Button>
                </div>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
      <div>
        <Table className="border min-w-full overflow-x-auto">
          <TableCaption className="mb-5">Data Customers</TableCaption>
          <TableHeader>
            <TableRow>
              {table.getHeaderGroups().map((headerGroup) => (
                <React.Fragment key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </TableHead>
                  ))}
                </React.Fragment>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Pagination className="flex justify-end gap-2 mt-5">
        <div className="flex items-center">
          <label className="mr-2">Page Size:</label>
          <select
            value={pagination.pageSize}
            onChange={handlePageSizeChange}
            className="border rounded p-1"
          >
            {[5, 10, 15, 20].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              className=" cursor-pointer"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            />
          </PaginationItem>

          <PaginationItem>
            <PaginationNext
              className=" cursor-pointer"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}

export default Customer;
