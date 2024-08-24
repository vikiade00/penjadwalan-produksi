import dayjs from "dayjs";
import { Button } from "@/components/ui/button";
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
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React, { useState, useEffect, useMemo } from "react";
import Loader from "@/components/ui/Loader";
import { Toaster } from "react-hot-toast";
import { useSpk } from "@/context/SpkContext";
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
import FinishedSpkTable from "./FinishedSpkTabel";
import BadgePrioritas from "@/components/BadgePrioritas";
import { useAuth } from "@/context/AuthContext";

function Spk() {
  const { spk, fetchSpk, updateSPKStatus, loading } = useSpk();
  const [selectedSPK, setSelectedSPK] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [globalFilter, setGlobalFilter] = useState("");
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5,
  });
  console.log(spk);
  const handlePageSizeChange = (event) => {
    const newPageSize = Number(event.target.value);
    setPagination((prev) => ({
      ...prev,
      pageSize: newPageSize,
      pageIndex: 0,
    }));
  };

  useEffect(() => {
    const loadSPK = async () => {
      try {
        await fetchSpk();
      } catch (error) {
        console.error("Failed to fetch SPK data:", error);
      }
    };

    loadSPK();
  }, [fetchSpk]);

  const handleStatusChange = async () => {
    try {
      let statusToUpdate = newStatus;

      if (newStatus === "Selesai") {
        const tenggat = dayjs(selectedSPK.id_pesanan?.tanggal_tenggat);
        const tanggalSelesai = dayjs(); // Mengambil tanggal hari ini

        if (tanggalSelesai.isAfter(tenggat)) {
          statusToUpdate = "Telat";
        }
      }

      await updateSPKStatus(selectedSPK._id, statusToUpdate);
      setIsConfirmDialogOpen(false);
      setIsStatusDialogOpen(false);
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const columns = useMemo(
    () => [
      {
        accessorFn: (row) => row.kode_spk || "",
        header: "Kode SPK",
      },
      {
        accessorFn: (row) => row.id_pesanan?.kode_pesanan || "",
        header: "Kode Pesanan",
      },
      {
        accessorFn: (row) => row.id_pesanan?.nama_customer || "",
        header: "Nama Customer",
      },
      {
        accessorFn: (row) => row.id_pesanan?.nama_produk || "",
        header: "Nama Produk",
      },
      {
        accessorFn: (row) => row.id_pesanan?.jumlah_produksi + "/Pcs" || "",
        header: "Jumlah Produksi",
      },
      {
        accessorFn: (row) =>
          dayjs(row.id_pesanan?.tanggal_tenggat).format("DD/MM/YYYY") || "",
        header: "Tanggal Tenggat",
      },
      {
        accessorFn: (row) => dayjs(row.tanggal_spk).format("DD/MM/YYYY") || "",
        header: "Tanggal Pengerjaan",
      },
      {
        accessorFn: (row) => row.status || "",
        header: "Status",
        cell: ({ row }) => <BadgeStatus status={row.original.status} />,
      },
      {
        accessorFn: (row) => row.status || "",
        header: "Prioritas",
        cell: ({ row }) => (
          <BadgePrioritas
            prioritas={row.original.id_pesanan?.prioritas_pesanan}
          />
        ),
      },
      {
        accessorFn: (row) => row.keterangan || "",
        header: "Keterangan",
      },
      {
        id: "action",
        header: "Aksi",
        cell: ({ row }) => {
          const { status } = row.original;
          const { user } = useAuth();

          if (user && user.role === "produksi") {
            return (
              <div className="flex">
                {(status === "Diproses" || status === "Dijeda") && (
                  <Button
                    onClick={() => {
                      setSelectedSPK(row.original);
                      setIsStatusDialogOpen(true);
                    }}
                    variant="outline"
                    className="mr-2 bg-blue-400 text-white"
                  >
                    Ubah Status
                  </Button>
                )}
              </div>
            );
          }
        },
      },
    ],
    []
  );
  const unfinishedSpk = spk.filter(
    (item) =>
      item.status !== "Selesai" &&
      item.status !== "Telat" &&
      item.status !== "Dibatalkan"
  );

  const table = useReactTable({
    data: unfinishedSpk,
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

  return (
    <div>
      <Toaster />
      <div className="text-2xl font-bold">Surat Perintah Kerja (SPK)</div>
      <div className="flex justify-between items-center w-full my-5">
        <GlobalFilter
          globalFilter={table.getState().globalFilter}
          setGlobalFilter={setGlobalFilter}
        />

        <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ubah Status SPK</DialogTitle>
              <DialogDescription>
                <p className="my-2">Pilih status baru untuk SPK ini:</p>

                <Select
                  value={newStatus}
                  onValueChange={(value) => setNewStatus(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Dijeda">Dijeda</SelectItem>
                    <SelectItem value="Diproses">Diproses</SelectItem>
                    <SelectItem value="Selesai">Selesai</SelectItem>
                    <SelectItem value="Dibatalkan">Dibatalkan</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex justify-end gap-2 mt-4">
                  <Button
                    variant="outline"
                    onClick={() => setIsStatusDialogOpen(false)}
                  >
                    Batal
                  </Button>
                  <Button
                    onClick={() => setIsConfirmDialogOpen(true)}
                    disabled={!newStatus}
                  >
                    Simpan
                  </Button>
                </div>
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
              <DialogTitle>Konfirmasi Perubahan Status</DialogTitle>
              <DialogDescription>
                <p>
                  Apakah Anda yakin ingin mengubah status SPK ini menjadi "
                  {newStatus}"? Perubahan ini akan mempengaruhi status pekerjaan
                  yang terkait.
                </p>
                <div className="flex justify-end gap-2 mt-4">
                  <Button
                    variant="outline"
                    onClick={() => setIsConfirmDialogOpen(false)}
                  >
                    Batal
                  </Button>
                  <Button onClick={handleStatusChange}>Ya, Ubah</Button>
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
          <TableCaption className="mb-5">
            Data Surat Perintah Kerja
          </TableCaption>
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
            {table.getRowModel().rows.length > 0 ? (
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
            ) : (
              <TableRow>
                <TableCell
                  colSpan={table.getAllColumns().length}
                  style={{ textAlign: "center" }}
                >
                  Pekerjaan belum ada, Anda bisa beristirahat :)
                </TableCell>
              </TableRow>
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
          <PaginationPrevious
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </PaginationPrevious>
          {table.getPageCount() > 1 &&
            table.getPageOptions().map((pageIndex) => (
              <PaginationItem
                key={pageIndex}
                active={pageIndex === pagination.pageIndex}
              >
                <PaginationLink onClick={() => table.setPageIndex(pageIndex)}>
                  {pageIndex + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
          <PaginationNext
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </PaginationNext>
        </PaginationContent>
      </Pagination>
      <div>
        <div className="text-2xl font-bold">PRODUKSI SELESAI</div>
        <div>
          <FinishedSpkTable />
        </div>
      </div>
    </div>
  );
}

export default Spk;
