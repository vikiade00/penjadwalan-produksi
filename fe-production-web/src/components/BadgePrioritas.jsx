import React from "react";

const BadgePrioritas = ({ prioritas }) => {
  // Tentukan warna berdasarkan prioritas
  const getColor = (prioritas) => {
    switch (prioritas) {
      case "Tinggi":
        return "bg-red-200 text-red-600";
      case "Sedang":
        return "bg-yellow-200 text-yellow-600";
      case "Rendah":
        return "bg-green-200 text-green-600";
      default:
        return "bg-gray-200 text-gray-600";
    }
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-sm font-semibold ${getColor(
        prioritas
      )}`}
    >
      {prioritas}
    </span>
  );
};

export default BadgePrioritas;
