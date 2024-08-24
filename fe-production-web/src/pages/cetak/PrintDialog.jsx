import React, { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import CetakLaporan from "./CetakLaporan";
import { usePrint } from "@/context/PrintContext";
import api from "@/api/api";
import axios from "axios";
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
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

const PrintDialog = ({ isOpen, onClose }) => {
  const { printData, printType, setType, setPrintData } = usePrint();
  const printRef = useRef();
  const [loading, setLoading] = useState(false);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: `Laporan-${printType}`,
    onAfterPrint: () => onClose(),
  });

  const fetchPrintData = async (type) => {
    try {
      setLoading(true);
      const response = await axios.get(`${api}/cetak/${type}`);
      if (response.data && response.data.data) {
        setType(type);
        setPrintData(response.data.data);
      } else {
        throw new Error("Unexpected response structure");
      }
    } catch (error) {
      console.error("Error fetching print data:", error);
      toast.error("Failed to fetch print data.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event) => {
    const selectedType = event.target.value;
    fetchPrintData(selectedType);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogHeader>
        <DialogTitle>Pilih Opsi Cetak</DialogTitle>
      </DialogHeader>
      <DialogContent>
        <DialogDescription>
          <Select
            value={printType}
            onValueChange={handleChange}
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
              <SelectItem value="status">Berdasarkan Status</SelectItem>
            </SelectContent>
          </Select>
        </DialogDescription>
      </DialogContent>
      <DialogContent>
        <Button onClick={onClose} color="secondary">
          Batal
        </Button>
        <Button onClick={handlePrint} color="primary" disabled={loading}>
          {loading ? "Loading..." : "Cetak"}
        </Button>
      </DialogContent>
      <div style={{ display: "none" }}>
        <CetakLaporan ref={printRef} data={printData} />
      </div>
    </Dialog>
  );
};

export default PrintDialog;
