import api from "@/api/api";
import { useAuth } from "@/context/AuthContext";
import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";

const LineChart = ({ startDate, endDate, granularity }) => {
  const { authToken } = useAuth();

  const getTokenRole = () => ({
    headers: {
      Authorization: `Bearer ${authToken}`, // Gunakan authToken dari konteks
    },
  });

  const [chartData, setChartData] = useState({
    series: [],
    options: {
      chart: {
        type: "area",
        height: 350,
      },
      colors: ["#F44336", "#E91E63", "#9C27B0"],
      xaxis: {
        categories: [],
        title: {
          text: "Periode",
        },
      },
      yaxis: {
        title: {
          text: "Jumlah Produksi",
        },
      },
      title: {
        text: "Grafik Jumlah Produksi",
        align: "left",
      },
    },
  });

  useEffect(() => {
    if (!authToken) return;

    const fetchChartData = async () => {
      // Validasi input, jika tidak ada startDate atau endDate, hentikan fetch
      if (!startDate || !endDate || !granularity) return;

      try {
        const response = await fetch(
          `${api}/jadwal/grafik-produksi/periode?startDate=${startDate}&endDate=${endDate}&granularity=${granularity}`,
          getTokenRole()
        );
        const data = await response.json();

        // Map labels berdasarkan granularity
        const labels = data.data.map((item) => {
          switch (granularity) {
            case "day":
              return `${item._id.year}-${item._id.month}-${item._id.day}`;
            case "week":
              return `Week ${item._id.week}, ${item._id.year}`;
            case "month":
              return `${item._id.year}-${item._id.month}`;
            default:
              return "";
          }
        });

        const values = data.data.map((item) => item.totalProduksi);

        // Update chart data dengan labels dan values yang baru
        setChartData({
          series: [
            {
              name: "Jumlah Produksi",
              data: values,
            },
          ],
          options: {
            ...chartData.options, // Menerapkan opsi default yang sudah ada
            xaxis: {
              ...chartData.options.xaxis,
              categories: labels,
            },
          },
        });
      } catch (error) {
        console.error("Error fetching chart data:", error);
      }
    };

    fetchChartData();
  }, [authToken, startDate, endDate, granularity]);

  return (
    <div className="">
      <ReactApexChart
        options={chartData.options}
        series={chartData.series}
        type="area"
        height={350}
      />
    </div>
  );
};

export default LineChart;
