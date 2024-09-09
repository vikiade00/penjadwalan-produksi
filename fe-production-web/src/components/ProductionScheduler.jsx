import React, { useEffect, useState } from "react";
import {
  ScheduleComponent,
  ViewsDirective,
  ViewDirective,
  Inject,
  Day,
  Week,
  WorkWeek,
  Month,
  Agenda,
  Resize,
  DragAndDrop,
} from "@syncfusion/ej2-react-schedule";
import dayjs from "dayjs";
import { useJadwalProduksi } from "@/context/JadwalProduksiContext";

const ProductionScheduler = () => {
  const { jadwalProduksi, updateJadwalProduksi } = useJadwalProduksi();
  const [events, setEvents] = useState([]);

  useEffect(() => {
    // Mengonversi data JSON menjadi format yang diterima oleh ScheduleComponent
    const convertedEvents = jadwalProduksi.map((item) => ({
      Id: item._id,
      Subject: `Pesanan: ${item.pesanan.nama_produk}`,
      StartTime: dayjs(item.tanggal_mulai).toDate(),
      EndTime: item.tanggal_selesai
        ? dayjs(item.tanggal_selesai).toDate()
        : dayjs(item.pesanan.estimasi_selesai).toDate(),
      Status: item.status,
      Description: item.keterangan,
      IdPesanan: item.id_pesanan,
    }));
    setEvents(convertedEvents);
  }, [jadwalProduksi]);

  const handleActionBegin = async (args) => {
    if (
      args.requestType === "eventChange" ||
      args.requestType === "eventCreate"
    ) {
      const updatedEvent = {
        Id: args.data.Id,
        StartTime: dayjs(args.data.StartTime).format("YYYY-MM-DDTHH:mm:ss"),
        EndTime: dayjs(args.data.EndTime).format("YYYY-MM-DDTHH:mm:ss"),
      };

      // Validasi tanggal
      if (dayjs(updatedEvent.EndTime).isBefore(updatedEvent.StartTime)) {
        args.cancel = true;
        alert("Tanggal selesai tidak boleh sebelum tanggal mulai");
        return;
      }

      // Update jadwal produksi melalui konteks
      await updateJadwalProduksi(updatedEvent.Id, {
        tanggal_mulai: updatedEvent.StartTime,
        tanggal_selesai: updatedEvent.EndTime,
      });

      // Perbarui state events
      setEvents(
        events.map((e) => (e.Id === updatedEvent.Id ? updatedEvent : e))
      );
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Atur Jadwal Produksi</h2>
      <ScheduleComponent
        height="650px"
        selectedDate={new Date()}
        eventSettings={{ dataSource: events }}
        actionBegin={handleActionBegin}
      >
        <ViewsDirective>
          <ViewDirective option="Day" />
          <ViewDirective option="Week" />
          <ViewDirective option="WorkWeek" />
          <ViewDirective option="Month" />
          <ViewDirective option="Agenda" />
        </ViewsDirective>
        <Inject
          services={[Day, Week, WorkWeek, Month, Agenda, Resize, DragAndDrop]}
        />
      </ScheduleComponent>
    </div>
  );
};

export default ProductionScheduler;
