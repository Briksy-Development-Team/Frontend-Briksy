import React from "react";

interface StatCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  active: boolean;
  dark: boolean;
  onClick: () => void;
}

const StatCard = ({ label, value, icon, active, dark, onClick }: StatCardProps) => (
  <button
    onClick={onClick}
    className={`
      w-full text-left p-5 rounded-2xl border transition-all duration-300 cursor-pointer group
      ${dark
        ? active
          ? "bg-white text-black border-white"
          : "bg-zinc-900 text-white border-zinc-800 hover:border-zinc-600"
        : active
          ? "bg-black text-white border-black"
          : "bg-white text-black border-zinc-200 hover:border-zinc-400"
      }
    `}
  >
    <div className={`
      w-9 h-9 rounded-xl flex items-center justify-center mb-3 transition-all duration-300
      ${active
        ? dark ? "bg-black text-white" : "bg-white text-black"
        : dark ? "bg-zinc-800 text-zinc-400 group-hover:text-white" : "bg-zinc-100 text-zinc-500 group-hover:text-black"
      }
    `}>
      {icon}
    </div>
    <div className="text-3xl font-bold tracking-tight leading-none mb-1">{value}</div>
    <div className={`text-xs font-medium tracking-wide ${active ? "opacity-70" : dark ? "text-zinc-500" : "text-zinc-400"}`}>
      {label}
    </div>
  </button>
);

export default StatCard;