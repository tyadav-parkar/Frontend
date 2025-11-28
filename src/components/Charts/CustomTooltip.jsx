
import React from "react";

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const { name, value } = payload[0]; // Recharts passes nameKey and dataKey here
    return (
      <div className="bg-white shadow-md rounded-lg p-3 border border-gray-300">
        <p className="text-xs font-semibold text-purple-800 mb-1">{name}</p>
        <p className="text-sm text-gray-600">
          Count:{" "}
          <span className="text-sm font-medium text-gray-900">{value}</span>
        </p>
      </div>
    );
  }
  return null;
};

export default CustomTooltip;
