import React, { useState } from "react";
import TaskCard from "./TaskCard";

export default function TaskList({
  tasks = [],
  filter = "all",
  onFilterChange,
  onToggleComplete,
  onDeleteTask,
  onToggleStar,
}) {
  const [viewMode, setViewMode] = useState("grid"); // 'grid' | 'list'

  // Filter tasks based on status
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

      {/* CONDITIONAL RENDERING: KONDISI DAFTAR KOSONG */}
      {tasks.length === 0 && (
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
      {tasks.length > 0 && filteredTasks.length === 0 && (
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
      {filteredTasks.length > 0 && (
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
