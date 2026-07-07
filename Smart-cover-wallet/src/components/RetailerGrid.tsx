"use client";

import React from "react";

interface Retailer {
  name: string;
  logo: string;
  category: string;
}

interface RetailerGridProps {
  retailers: Retailer[];
}

const retailerColors: Record<string, string> = {
  PnP: "bg-blue-600",
  CHK: "bg-red-600",
  SHP: "bg-red-500",
  WW: "bg-purple-700",
  SPR: "bg-red-700",
  FLM: "bg-green-600",
  MKR: "bg-blue-800",
  OK: "bg-orange-500",
  BOX: "bg-yellow-600",
};

export default function RetailerGrid({ retailers }: RetailerGridProps) {
  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-800">Participating Retailers</h3>
        <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
          1% Cashback
        </span>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {retailers.map((retailer) => (
          <div
            key={retailer.name}
            className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center text-white text-xs font-bold ${
                retailerColors[retailer.logo] || "bg-gray-600"
              }`}
            >
              {retailer.logo}
            </div>
            <span className="text-xs text-gray-600 text-center font-medium leading-tight">
              {retailer.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
