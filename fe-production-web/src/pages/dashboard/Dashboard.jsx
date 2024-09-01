import React, { useState } from "react";
import Cards from "./components/Card";
import { DateTimePicker } from "./components/DateTimePicker";
import { Button } from "@/components/ui/button";
import LineChart from "./components/LineChart";
import { startOfMonth, endOfMonth } from "date-fns";
import toast from "react-hot-toast";
import {
  Dialog,
  DialogContent,
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
import { usePrint } from "@/context/PrintContext";

function Dashboard() {
  const { cetak, loading } = usePrint();
  const [dateRange, setDateRange] = useState({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date()),
  });
  const [granularity, setGranularity] = useState("day");
  const [isPrintDialogOpen, setPrintDialogOpen] = useState(false);
  const [printType, setPrintType] = useState("semua-periode");

  const handleDateChange = (from, to) => {
    setDateRange({ from, to });
  };

  const handleGranularityChange = (event) => {
    setGranularity(event.target.value);
  };

  const openPrintDialog = () => {
    setPrintDialogOpen(true);
  };

  const handlePrint = () => {
    setPrintDialogOpen(false); // Tutup dialog sebelum cetak
    cetak(printType, {
      start: dateRange.from.toISOString(),
      end: dateRange.to.toISOString(),
    });
  };

  const handleChangePrintType = (value) => {
    setPrintType(value);
  };

  return (
    <div>
      <div className="flex items-center">
        <h1 className="text-lg font-bold md:text-2xl">Dashboard</h1>
      </div>
      <div>
        <Cards />
      </div>
      <div className="mt-5">
        <div className="mb-5">
          <div className="text-xl font-bold">Grafik Produksi</div>
        </div>
        <div className="flex gap-5 flex-col sm:flex-row sm:items-center">
          <DateTimePicker onDateChange={handleDateChange} />
          <div>
            <select
              value={granularity}
              onChange={handleGranularityChange}
              className="border border-gray-300 rounded-md p-2"
            >
              <option value="day">Harian</option>
              <option value="week">Mingguan</option>
              <option value="month">Bulanan</option>
            </select>
          </div>
          <div>
            <Button onClick={openPrintDialog}>Cetak</Button>
          </div>
        </div>
        <div className="p-10">
          <LineChart
            startDate={dateRange.from.toISOString().split("T")[0]}
            endDate={dateRange.to.toISOString().split("T")[0]}
            granularity={granularity}
          />
        </div>
      </div>

      <Dialog open={isPrintDialogOpen} onOpenChange={setPrintDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Pilih Opsi Cetak</DialogTitle>
          </DialogHeader>
          <Select
            value={printType}
            onValueChange={handleChangePrintType}
            defaultValue="semua-periode"
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih Opsi" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="semua-periode">Semua Periode</SelectItem>
              <SelectItem value="harian">Harian</SelectItem>
              <SelectItem value="mingguan">Mingguan</SelectItem>
              <SelectItem value="tahunan">Tahunan</SelectItem>
            </SelectContent>
          </Select>
          <div className="mt-4 flex gap-4">
            <Button onClick={() => setPrintDialogOpen(false)} color="secondary">
              Batal
            </Button>
            <Button onClick={handlePrint} color="primary" disabled={loading}>
              {loading ? "Loading..." : "Cetak"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Dashboard;
