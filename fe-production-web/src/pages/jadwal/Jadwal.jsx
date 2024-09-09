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
import React, { useState, useEffect, useMemo } from "react";
import { Label } from "@/components/ui/label";
import { useJadwalProduksi } from "@/context/JadwalProduksiContext";
import Loader from "@/components/ui/Loader";
import toast, { Toaster } from "react-hot-toast";
import BadgeStatus from "@/components/BadgeStatus";
import BadgePrioritas from "@/components/BadgePrioritas";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { GlobalFilter } from "@/components/GlobalFillter";
import { useAuth } from "@/context/AuthContext";

function JadwalProduksi() {
  const { jadwalProduksi, fetchJadwalProduksiByPrioritas, createSPK, loading } =
    useJadwalProduksi();
  const [newSPK, setNewSPK] = useState({
    id_jadwal_produksi: "",
    tanggal_spk: dayjs().format("YYYY-MM-DD"),
    keterangan: "",
  });

  const [selectedJadwal, setSelectedJadwal] = useState(null);
  const [isSPKDialogOpen, setIsSPKDialogOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
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
    const loadJadwalProduksi = async () => {
      await fetchJadwalProduksiByPrioritas();
    };

    loadJadwalProduksi();
  }, []);

  const columns = useMemo(
    () => [
      {
        accessorFn: (row) => row.pesanan?.kode_pesanan || "",
        header: "Kode Pesanan",
      },
      // {
      //   accessorFn: (row) => row.pesanan?.id_customer?.nama || "",
      //   header: "Nama Customer",
      // },
      {
        accessorFn: (row) => row.pesanan?.nama_produk || "",
        header: "Nama Produk",
      },
      {
        accessorFn: (row) => row?.jumlah_produksi + "/Pcs" || "",
        header: "Jumlah Produk",
      },
      {
        accessorFn: (row) =>
          dayjs(row.pesanan?.tanggal_tenggat || "").format("DD/MM/YYYY"),
        header: "Tanggal Tenggat",
      },
      {
        accessorFn: (row) => {
          // Jika tanggal_mulai tidak ada atau null, tampilkan "Belum Mulai"
          if (!row.tanggal_mulai) {
            return "Belum Mulai";
          }
          // Jika ada, format tanggalnya menjadi DD/MM/YYYY
          return dayjs(row.tanggal_mulai).format("DD/MM/YYYY");
        },
        header: "Tanggal Mulai",
      },
      {
        accessorFn: (row) =>
          row.tanggal_selesai
            ? dayjs(row.tanggal_selesai).format("DD/MM/YYYY")
            : "Belum Selesai",
        header: "Tanggal Selesai",
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => <BadgeStatus status={row.original.status} />,
      },
      {
        header: "Prioritas",
        accessorFn: (row) => row.pesanan?.prioritas_pesanan || "Tidak Ada",
        cell: (info) => <BadgePrioritas prioritas={info.getValue()} />,
      },
      {
        accessorFn: (row) =>
          row.pesanan?.nilai_prioritas
            ? row.pesanan.nilai_prioritas.toFixed(2)
            : "",
        header: "Skor",
      },
      {
        accessorKey: "keterangan",
        header: "Keterangan",
      },
      {
        id: "action",
        header: "Action",
        cell: ({ row }) => {
          const { status } = row.original;
          const { user } = useAuth();

          // Periksa apakah pengguna memiliki role "admin"
          if (user && user.role === "admin") {
            return (
              <div className="flex">
                {status === "Menunggu" && (
                  <Button
                    className="mr-2 bg-blue-500"
                    onClick={() => handleOpenSPKDialog(row.original)}
                  >
                    Buat SPK
                  </Button>
                )}
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
    data: jadwalProduksi,
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

  const handleSPKInputChange = (e) => {
    const { name, value } = e.target;
    setNewSPK((prev) => ({ ...prev, [name]: value }));
  };

  const openConfirmDialog = () => {
    const tanggalTenggat = selectedJadwal?.id_pesanan?.tanggal_tenggat;
    if (new Date(newSPK.tanggal_spk) > new Date(tanggalTenggat)) {
      toast.error("Tanggal SPK tidak boleh melebihi tanggal tenggat pesanan");
      return;
    }
    setIsConfirmDialogOpen(true);
  };

  const handleSPKSubmit = async () => {
    if (!newSPK.id_jadwal_produksi) {
      console.error("ID Jadwal Produksi tidak boleh kosong.");
      return;
    }
    await createSPK(newSPK);
    setIsSPKDialogOpen(false);
    setIsConfirmDialogOpen(false);
    setNewSPK({
      id_jadwal_produksi: "",
      tanggal_spk: dayjs().format("YYYY-MM-DD"),
      keterangan: "",
    });
  };

  const handleConfirmSubmit = () => {
    handleSPKSubmit();
  };

  const handleOpenSPKDialog = (jadwal) => {
    setSelectedJadwal(jadwal);
    setNewSPK((prev) => ({
      ...prev,
      id_jadwal_produksi: jadwal._id,
    }));
    setIsSPKDialogOpen(true);
  };

  return (
    <div>
      <Toaster />
      <div className="text-2xl font-bold">Jadwal Produksi</div>
      <div className="flex justify-between items-center w-full my-5">
        <GlobalFilter
          globalFilter={table.getState().globalFilter}
          setGlobalFilter={setGlobalFilter}
        />

        <Dialog open={isSPKDialogOpen} onOpenChange={setIsSPKDialogOpen}>
          <DialogTrigger></DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Buat SPK</DialogTitle>
              <DialogDescription>
                <form
                  className="mt-5"
                  onSubmit={(e) => {
                    e.preventDefault();
                    openConfirmDialog();
                  }}
                >
                  <Label htmlFor="tanggal_spk">Tanggal SPK</Label>
                  <Input
                    id="tanggal_spk"
                    type="date"
                    name="tanggal_spk"
                    value={newSPK.tanggal_spk}
                    onChange={handleSPKInputChange}
                    required
                  />
                  {/* <Label htmlFor="keterangan">Masukan Jumlah Produksi</Label>
                  <Input
                    id="keterangan"
                    type="text"
                    name="keterangan"
                    value={newSPK.keterangan}
                    onChange={handleSPKInputChange}
                    required
                  /> */}
                  <Label htmlFor="keterangan">Keterangan</Label>
                  <Input
                    id="keterangan"
                    type="text"
                    name="keterangan"
                    value={newSPK.keterangan}
                    onChange={handleSPKInputChange}
                    required
                  />
                  <Button className="my-3" type="submit">
                    Buat SPK
                  </Button>
                </form>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>

        <Dialog
          open={isConfirmDialogOpen}
          onOpenChange={setIsConfirmDialogOpen}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Konfirmasi</DialogTitle>
              <DialogDescription>
                <p>
                  Apakah Anda yakin ingin membuat SPK dengan rincian berikut?
                </p>
                <ul>
                  <li>
                    <strong>Tanggal SPK:</strong> {newSPK.tanggal_spk}
                  </li>
                  <li>
                    <strong>Keterangan:</strong> {newSPK.keterangan}
                  </li>
                </ul>
                <div className="flex justify-end mt-4">
                  <Button
                    onClick={handleConfirmSubmit}
                    className="bg-blue-500 text-white"
                  >
                    Ya, Buat SPK
                  </Button>
                  <Button
                    onClick={() => setIsConfirmDialogOpen(false)}
                    className="ml-3"
                  >
                    Batal
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
          <TableCaption className="mb-5">Data Jadwal Produksi</TableCaption>
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
            {table.getRowModel().rows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={table.getHeaderGroups()[0].headers.length}
                  className="text-center"
                >
                  Jadwal Produksi Belum Ada :)
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
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

export default JadwalProduksi;
