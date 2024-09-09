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

function FinishedSpkTable() {
  const { spk, fetchSpk, loading } = useSpk();
  const [globalFilter, setGlobalFilter] = useState("");
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5,
  });

  useEffect(() => {
    fetchSpk();
  }, [fetchSpk]);

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
        accessorFn: (row) =>
          dayjs(row.id_pesanan?.tanggal_tenggat).format("DD/MM/YYYY") || "",
        header: "Tanggal Tenggat",
      },
      {
        accessorFn: (row) =>
          row.id_jadwal_produksi?.jumlah_produksi + "/Pcs" || "",
        header: "Jumlah Produksi",
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
    ],
    []
  );

  const finishedSpk = spk.filter(
    (item) =>
      item.status === "Selesai" ||
      item.status === "Telat" ||
      item.status === "Dibatalkan"
  );

  const table = useReactTable({
    data: finishedSpk,
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

  const handlePageSizeChange = (event) => {
    const newPageSize = Number(event.target.value);
    setPagination((prev) => ({
      ...prev,
      pageSize: newPageSize,
      pageIndex: 0,
    }));
  };

  return (
    <div>
      <Toaster />
      <div className="flex justify-between items-center w-full my-5">
        <GlobalFilter
          globalFilter={table.getState().globalFilter}
          setGlobalFilter={setGlobalFilter}
        />
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
            {[5, 10, 20].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
        <PaginationContent>
          <PaginationPrevious
            onClick={() =>
              table.setPageIndex(table.getState().pagination.pageIndex - 1)
            }
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </PaginationPrevious>
          <PaginationNext
            onClick={() =>
              table.setPageIndex(table.getState().pagination.pageIndex + 1)
            }
            disabled={!table.getCanNextPage()}
          >
            Next
          </PaginationNext>
        </PaginationContent>
      </Pagination>
    </div>
  );
}

export default FinishedSpkTable;
