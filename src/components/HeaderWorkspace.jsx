import React, { useState } from "react";

export default function HeaderWorkspace({ onOpenModal }) {
  // State lokal agar bisa mengetik tanpa mengaktifkan fitur pencarian
  const [searchValue, setSearchValue] = useState("");

  return (
    <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
      {/* Tab Navigation */}
      <div className="flex items-center gap-6">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 select-none">
          Projects
        </h1>
      </div>

      {/* Action Controls & CTA Button */}
      <div className="flex items-center gap-3">
        {/* Tombol Tambahkan Catatan */}
        <button
          type="button"
          onClick={onOpenModal}
          className="bg-[#1EBBA6] hover:bg-[#189e8c] active:scale-95 text-white font-medium text-xs sm:text-sm px-5 py-2.5 rounded-full shadow-sm hover:shadow-teal-500/20 transition-all flex items-center gap-2 cursor-pointer shrink-0"
        >
          <span className="text-base leading-none font-bold">+</span>
          <span>tambahkan catatan</span>
        </button>

        {/* Search Bar dengan ukuran py-2.5 dan border yang jelas, bisa mengetik */}
        <div className="flex items-center bg-white border border-slate-300 hover:border-slate-400 focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-500/20 rounded-full px-4 py-2.5 shadow-xs transition-all">
          <svg className="w-4 h-4 text-slate-400 mr-2.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search..."
            className="w-36 sm:w-52 text-xs sm:text-sm bg-transparent outline-none text-slate-700 placeholder-slate-400"
          />
        </div>
      </div>
    </header>
  );
}
