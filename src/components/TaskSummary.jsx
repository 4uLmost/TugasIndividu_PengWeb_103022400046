import React from "react";

export default function TaskSummary({ tasks = [], user = "Dhiyaul" }) {
  // Hitung statistik metrik secara dinamis
  const totalCount = tasks.length;
  const completedCount = tasks.filter((t) => t.completed).length;
  const inProgressCount = tasks.filter((t) => !t.completed).length;

  return (
    <aside className="w-full lg:w-80 bg-white border-t lg:border-t-0 lg:border-l border-slate-200 p-6 flex flex-col justify-between shrink-0">
      <div className="space-y-6">
        {/* User Profile Header */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium">Hello,</p>
            <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">{user}</h2>
          </div>

          <div className="flex items-center">
            <div className="w-11 h-11 rounded-full bg-[#FF8566] flex items-center justify-center shadow-xs">
              <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="8" r="4" strokeWidth="2" />
                <path strokeWidth="2" d="M4 20c0-3.5 3.5-5 8-5s8 1.5 8 5" />
              </svg>
            </div>
          </div>
        </div>

        {/* 2x2 Metric Counters */}
        <div className="grid grid-cols-2 gap-y-4 gap-x-3 pt-3 border-t border-slate-100">
          <div>
            <p className="text-[11px] text-slate-400 font-medium">Total Tugas</p>
            <p className="text-xl font-bold text-slate-900 mt-0.5">
              <span className="text-slate-400 font-light mr-1">|</span> {totalCount}
            </p>
          </div>

          <div>
            <p className="text-[11px] text-slate-400 font-medium">Selesai:</p>
            <p className="text-xl font-bold text-teal-600 mt-0.5">
              <span className="text-slate-400 font-light mr-1">|</span> {completedCount}
            </p>
          </div>

          <div>
            <p className="text-[11px] text-slate-400 font-medium">Dalam Pengerjaan:</p>
            <p className="text-xl font-bold text-amber-500 mt-0.5">
              <span className="text-slate-400 font-light mr-1">|</span> {inProgressCount}
            </p>
          </div>

          <div>
            <p className="text-[11px] text-slate-400 font-medium">Telat:</p>
            <p className="text-xl font-bold text-rose-500 mt-0.5">
              <span className="text-slate-400 font-light mr-1">|</span> 0
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
