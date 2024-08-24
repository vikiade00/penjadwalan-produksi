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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React, { useState, useEffect, useMemo } from "react";
import { Label } from "@/components/ui/label";
import { usePesanan } from "@/context/PesananContext";
import Loader from "@/components/ui/Loader";
import toast, { Toaster } from "react-hot-toast";
import BadgePrioritas from "@/components/BadgePrioritas";
import BadgeStatus from "@/components/BadgeStatus";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { GlobalFilter } from "@/components/GlobalFillter";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { globalFilterFn } from "@/components/GlobalFilterFn";
import { useAuth } from "@/context/AuthContext";

function Pesanan() {
  const { user } = useAuth();
  const {
    pesanan,
    fetchPesanan,
    addPesanan,
    updatePesanan,
    removePesanan,
    customers,
    products,
  } = usePesanan();

  const [newPesanan, setNewPesanan] = useState({
    id_customer: "",
    nama_produk: "",
    tanggal_pesanan: "",
    tanggal_tenggat: "",
    jumlah_produksi: "",
    keterangan: "",
  });

  const [selectedPesanan, setSelectedPesanan] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dialogMode, setDialogMode] = useState("add");
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

  useEffect(() => {
    const loadPesanan = async () => {
      setLoading(true);
      await fetchPesanan();
      setLoading(false);
    };

    loadPesanan();
  }, []);

  const columns = useMemo(
    () => [
      {
        accessorKey: "kode_pesanan",
        header: "Kode Pesanan",
      },
      {
        accessorFn: (row) => row.id_customer?.nama || "",
        header: "Nama Customer",
      },
      {
        accessorFn: (row) => row.id_customer?.alamat || "",
        header: "Alamat",
      },

      {
        accessorKey: "nama_produk",
        header: "Nama Produk",
      },
      {
        accessorFn: (row) => dayjs(row.tanggal_pesanan).format("DD/MM/YYYY"),
        id: "tanggal_pesanan",
        header: "Tanggal Pesanan",
      },
      {
        accessorFn: (row) => dayjs(row.tanggal_tenggat).format("DD/MM/YYYY"),
        id: "tanggal_tenggat",
        header: "Tanggal Tenggat",
      },
      {
        cell: ({ row }) => row.original.jumlah_produksi + "/Pcs",
        header: "Jumlah Produksi",
      },
      {
        accessorKey: "status_pesanan",
        header: "Status Pesanan",
        cell: ({ row }) => <BadgeStatus status={row.original.status_pesanan} />,
      },
      {
        accessorKey: "prioritas_pesanan",
        header: "Prioritas",
        cell: ({ row }) => (
          <BadgePrioritas prioritas={row.original.prioritas_pesanan} />
        ),
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
    data: pesanan,
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPesanan((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validasi tanggal_tenggat tidak boleh kurang dari tanggal_pesanan
    if (
      new Date(newPesanan.tanggal_tenggat) <
      new Date(newPesanan.tanggal_pesanan)
    ) {
      return toast.error(
        "Tanggal tenggat tidak boleh kurang dari tanggal pesanan"
      );
    }

    setLoading(true);
    try {
      if (dialogMode === "add") {
        await addPesanan(newPesanan);
      } else {
        await updatePesanan(selectedPesanan._id, newPesanan);
      }
      // Fetch pesanan terbaru setelah menambah atau memperbarui
      await fetchPesanan();
      setIsDialogOpen(false);
      setNewPesanan({
        id_customer: "",
        nama_produk: "",
        tanggal_pesanan: "",
        tanggal_tenggat: "",
        jumlah_produksi: "",
        keterangan: "",
      });
    } catch (error) {
      toast.error("Terjadi kesalahan saat menyimpan pesanan");
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (pesanan) => {
    setSelectedPesanan(pesanan);
    setNewPesanan({
      id_customer: pesanan.id_customer._id,
      nama_produk: pesanan.nama_produk,
      tanggal_pesanan: dayjs(pesanan.tanggal_pesanan).format("YYYY-MM-DD"),
      tanggal_tenggat: dayjs(pesanan.tanggal_tenggat).format("YYYY-MM-DD"),
      jumlah_produksi: pesanan.jumlah_produksi,
      keterangan: pesanan.keterangan,
    });
    setDialogMode("edit");
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (pesanan) => {
    setSelectedPesanan(pesanan);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    await removePesanan(selectedPesanan._id);
    setIsDeleteDialogOpen(false);
  };

  const isEditDisabled = (status) => {
    return status !== "Menunggu";
  };

  return (
    <div>
      <Toaster />
      <div className="text-2xl font-bold">Pesanan</div>
      <div className="flex justify-between items-center w-full my-5">
        <GlobalFilter
          globalFilter={table.getState().globalFilter}
          setGlobalFilter={setGlobalFilter}
        />
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          {user.role === "admin" && (
            <DialogTrigger>
              <Button
                onClick={() => {
                  setDialogMode("add");
                  setNewPesanan({
                    id_customer: "",
                    nama_produk: "",
                    tanggal_pesanan: "",
                    tanggal_tenggat: "",
                    jumlah_produksi: "",
                    keterangan: "",
                  });
                  setIsDialogOpen(true);
                }}
              >
                Tambah
              </Button>
            </DialogTrigger>
          )}
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {dialogMode === "add" ? "Tambah Pesanan" : "Edit Pesanan"}
              </DialogTitle>
              <DialogDescription>
                <form
                  className="mt-5 flex flex-col gap-3"
                  onSubmit={handleSubmit}
                >
                  <Label htmlFor="id_customer">Customer</Label>
                  <Select
                    id="id_customer"
                    value={newPesanan.id_customer}
                    onValueChange={(value) =>
                      setNewPesanan({ ...newPesanan, id_customer: value })
                    }
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih Customer" />
                    </SelectTrigger>
                    <SelectContent>
                      {customers.map((customer) => (
                        <SelectItem key={customer._id} value={customer._id}>
                          {customer.nama}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Label htmlFor="nama_produk">Nama Produk</Label>
                  <Input
                    id="nama_produk"
                    type="text"
                    name="nama_produk"
                    value={newPesanan.nama_produk}
                    onChange={handleInputChange}
                    required
                  />
                  <Label htmlFor="tanggal_pesanan">Tanggal Pesanan</Label>
                  <Input
                    id="tanggal_pesanan"
                    type="date"
                    name="tanggal_pesanan"
                    value={newPesanan.tanggal_pesanan}
                    onChange={handleInputChange}
                    required
                  />
                  <Label htmlFor="tanggal_tenggat">Tanggal Tenggat</Label>
                  <Input
                    id="tanggal_tenggat"
                    type="date"
                    name="tanggal_tenggat"
                    value={newPesanan.tanggal_tenggat}
                    onChange={handleInputChange}
                    required
                  />
                  <Label htmlFor="jumlah_produksi">Jumlah Produksi</Label>
                  <Input
                    id="jumlah_produksi"
                    type="number"
                    name="jumlah_produksi"
                    value={newPesanan.jumlah_produksi}
                    onChange={handleInputChange}
                    required
                  />
                  <Label htmlFor="keterangan">Keterangan</Label>
                  <Input
                    id="keterangan"
                    type="text"
                    name="keterangan"
                    value={newPesanan.keterangan}
                    onChange={handleInputChange}
                    required
                  />
                  <Button className="my-3" type="submit">
                    {dialogMode === "add" ? "Tambah" : "Perbarui"}
                  </Button>
                </form>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Hapus Pesanan</DialogTitle>
              <DialogDescription>
                <p>
                  Apakah Anda yakin ingin menghapus pesanan ini? Jika Anda
                  melanjutkan, semua informasi terkait pesanan ini, termasuk
                  yang ada di jadwal dan SPK, akan dihapus secara permanen.
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

      {loading ? (
        <Loader />
      ) : (
        <Table className="border overflow-x-auto">
          <TableCaption className="mb-5">Data Pesanan</TableCaption>
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
      )}
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
          {table.getPageCount() > 0 &&
            Array.from({ length: table.getPageCount() }, (_, i) => i + 1).map(
              (page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    className=" cursor-pointer"
                    onClick={() => table.setPageIndex(page - 1)}
                    isActive={
                      page === table.getState().pagination.pageIndex + 1
                    }
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              )
            )}
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

export default Pesanan;
