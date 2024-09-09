import React from "react";

const BadgePrioritas = ({ prioritas }) => {
  // Tentukan warna dan teks berdasarkan prioritas (skala 1-5)
  const getPrioritasLabel = (prioritas) => {
    switch (prioritas) {
      case 5:
        return { label: "VeryHigh", color: "bg-red-200 text-red-600" };
      case 4:
        return { label: "High", color: "bg-orange-200 text-orange-600" };
      case 3:
        return { label: "Medium", color: "bg-yellow-200 text-yellow-600" };
      case 2:
        return { label: "Low", color: "bg-green-200 text-green-600" };
      case 1:
        return { label: "Very Low", color: "bg-blue-200 text-blue-600 " };
      default:
        return { label: "unknown", color: "bg-gray-200 text-gray-600" };
    }
  };

  const { label, color } = getPrioritasLabel(prioritas);

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${color}`}>
      {label}
    </span>
  );
};

export default BadgePrioritas;
