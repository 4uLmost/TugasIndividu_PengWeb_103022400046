import React, { useState } from "react";
import TaskCard from "./TaskCard";

export default function TaskList({
  tasks = [],
  isLoading = false,
  errorMessage = null,
  onRetry,
  filter = "all",
  onFilterChange,
  onToggleComplete,
  onDeleteTask,
  onToggleStar,
}) {
  const [viewMode, setViewMode] = useState("grid"); // 'grid' | 'list'

  // Filter tasks berdasarkan status selesai / belum
  const filteredTasks = tasks.filter((task) => {
    if (filter === "completed") return task.completed;
    if (filter === "in-progress") return !task.completed;
    return true;
  });

  const totalCount = tasks.length;
  const completedCount = tasks.filter((t) => t.completed).length;
  const inProgressCount = tasks.filter((t) => !t.completed).length;

  return (
    <div className="space-y-6">
      {/* Control & Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 py-3">
        <div className="flex items-center gap-3">
          {/* View Toggle: Grid / List */}
          <div className="flex items-center bg-white border border-slate-200 rounded-xl p-1 shadow-2xs">
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-lg transition ${
                viewMode === "grid"
                  ? "bg-slate-100 text-slate-900"
                  : "text-slate-400 hover:text-slate-700"
              }`}
              title="Tampilan Grid"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <rect x="3" y="3" width="7" height="7" rx="2" strokeWidth="2" />
                <rect x="14" y="3" width="7" height="7" rx="2" strokeWidth="2" />
                <rect x="3" y="14" width="7" height="7" rx="2" strokeWidth="2" />
                <rect x="14" y="14" width="7" height="7" rx="2" strokeWidth="2" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-lg transition ${
                viewMode === "list"
                  ? "bg-slate-100 text-slate-900"
                  : "text-slate-400 hover:text-slate-700"
              }`}
              title="Tampilan List"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeWidth="2" strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          {/* Status Filter Dropdown */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400 font-medium">Filter:</span>
            <select
              value={filter}
              onChange={(e) => onFilterChange && onFilterChange(e.target.value)}
              className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-teal-500 shadow-2xs cursor-pointer"
            >
              <option value="all">Semua ({totalCount})</option>
              <option value="in-progress">In Progress ({inProgressCount})</option>
              <option value="completed">Completed ({completedCount})</option>
            </select>
          </div>
        </div>
      </div>

      {/* 1. KONDISI LOADING: Skeleton Loader Cards */}
      {isLoading && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400 animate-pulse pb-1">
            <span>Sedang memuat data dari REST API JSONPlaceholder...</span>
            <span className="font-semibold text-teal-600">Loading AJAX...</span>
          </div>
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5"
                : "flex flex-col space-y-3"
            }
          >
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm animate-pulse space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="h-4 bg-slate-200 rounded w-2/3"></div>
                  <div className="h-5 bg-slate-100 rounded-full w-16"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-slate-100 rounded w-full"></div>
                  <div className="h-3 bg-slate-100 rounded w-4/5"></div>
                </div>
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="h-3 bg-slate-200 rounded w-20"></div>
                  <div className="h-4 bg-slate-100 rounded w-10"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. KONDISI ERROR: Alert Box Merah + Tombol "Coba Lagi" */}
      {!isLoading && errorMessage && (
        <div className="bg-rose-50 border border-rose-200/90 rounded-2xl p-8 text-center max-w-md mx-auto my-12 space-y-4 shadow-sm animate-in fade-in duration-200">
          <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto text-xl font-bold">
            !
          </div>
          <div>
            <h3 className="text-base font-bold text-rose-900">Gagal Mengambil Data</h3>
            <p className="text-xs text-rose-700 mt-1 leading-relaxed">{errorMessage}</p>
          </div>
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs px-5 py-2.5 rounded-xl shadow-xs transition active:scale-95 cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeWidth="2"
                strokeLinecap="round"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            <span>Coba Lagi</span>
          </button>
        </div>
      )}

      {/* 3. KONDISI SUCCESS: Render Daftar Tugas atau Empty State */}
      {!isLoading && !errorMessage && tasks.length === 0 && (
        <div className="text-center py-16 px-4 bg-white rounded-2xl border border-dashed border-slate-300 shadow-sm space-y-2">
          <p className="text-base font-bold text-slate-700">
            Belum ada data Tugas. Silakan tambahkan tugas baru melalui tombol di atas.
          </p>
          <p className="text-xs text-slate-400">
            Daftar tugas sedang kosong.
          </p>
        </div>
      )}

      {/* Filter menghasilkan 0 item (tetapi ada data total) */}
      {!isLoading && !errorMessage && tasks.length > 0 && filteredTasks.length === 0 && (
        <div className="text-center py-14 bg-white rounded-2xl border border-dashed border-slate-200">
          <p className="text-sm font-semibold text-slate-600">
            Tidak ada tugas pada kategori filter "{filter}".
          </p>
          <button
            type="button"
            onClick={() => onFilterChange && onFilterChange("all")}
            className="text-xs text-teal-600 font-bold mt-2 hover:underline inline-block cursor-pointer"
          >
            Tampilkan Semua Tugas
          </button>
        </div>
      )}

      {/* RENDER LIST DENGAN .map() */}
      {!isLoading && !errorMessage && filteredTasks.length > 0 && (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5"
              : "flex flex-col space-y-3"
          }
        >
          {filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onToggleComplete={onToggleComplete}
              onDeleteTask={onDeleteTask}
              onToggleStar={onToggleStar}
            />
          ))}
        </div>
      )}
    </div>
  );
}
