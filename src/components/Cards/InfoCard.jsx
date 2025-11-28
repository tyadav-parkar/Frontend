
// src/components/InfoCard.jsx
import React from "react";

/**
 * InfoCard
 * Props:
 * - icon: ReactNode (e.g., <IoMdCard className="text-3xl" />)
 * - label: string
 * - value: string | number
 * - color: string (Tailwind bg class, e.g., "bg-primary", "bg-yellow-500")
 */
const InfoCard = ({ icon, label, value, color = "bg-slate-200" }) => {
  return (
    <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow hover:shadow-md transition">
      <div
        className={`w-12 h-12 flex items-center justify-center rounded-full ${color} text-white`}
      >
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <h3 className="text-xl font-semibold text-gray-800">{value}</h3>
      </div>
    </div>
  );
};

export default InfoCard;
