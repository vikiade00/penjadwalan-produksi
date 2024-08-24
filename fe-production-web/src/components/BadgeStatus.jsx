import React from "react";

const BadgeStatus = ({ status }) => {
  // Tentukan warna berdasarkan status
  const getColor = (status) => {
    switch (status) {
      case "Menunggu":
        return "bg-gray-200 text-gray-600";
      case "Diproses":
        return "bg-yellow-200 text-yellow-600";
      case "Selesai":
        return "bg-green-200 text-green-600";
      case "Dibatalkan":
        return "bg-red-200 text-red-600";
      case "Telat":
        return "bg-purple-400 text-purple-900";
      default:
        return "bg-gray-500 text-white";
    }
  };

  return (
    <span
      className={`px-3 py-1 rounded-full font-semibold text-sm ${getColor(
        status
      )}`}
    >
      {status}
    </span>
  );
};

export default BadgeStatus;
