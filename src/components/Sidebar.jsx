import React from "react";

export default function Sidebar({ activeNav = "dashboard", onNavChange }) {
  return (
    <aside className="w-full lg:w-20 bg-white border-b lg:border-b-0 lg:border-r border-slate-200 flex lg:flex-col items-center justify-between lg:justify-start gap-8 p-4 lg:py-6 shrink-0">
      {/* Lingkaran berwarna ungu */}
      <div className="w-10 h-10 rounded-full bg-[#7059A6] shadow-sm flex items-center justify-center"></div>

      {/* Navigasi tunggal (paling atas saja) */}
      <nav className="flex items-center">
        <button
          type="button"
          title="Dashboard"
          onClick={() => onNavChange && onNavChange("dashboard")}
          className={`p-2.5 rounded-xl transition-all shadow-xs ${
            activeNav === "dashboard"
              ? "bg-slate-100 text-slate-900"
              : "text-slate-400 hover:text-slate-700 hover:bg-slate-50"
          }`}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <rect x="3" y="3" width="7" height="7" rx="2" strokeWidth="2" />
            <rect x="14" y="3" width="7" height="7" rx="2" strokeWidth="2" />
            <rect x="3" y="14" width="7" height="7" rx="2" strokeWidth="2" />
            <rect x="14" y="14" width="7" height="7" rx="2" strokeWidth="2" />
          </svg>
        </button>
      </nav>
    </aside>
  );
}
