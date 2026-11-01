import React, { useState } from "react";

export default function TaskCard({
  task,
  onToggleComplete,
  onDeleteTask,
  onToggleStar,
}) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between group relative">
      <div>
        {/* Card Header: Title & Status Badge */}
        <div className="flex items-start justify-between gap-2 mb-2.5">
          <h3
            className={`font-bold text-sm sm:text-base capitalize line-clamp-1 transition cursor-pointer ${
              task.completed
                ? "text-slate-400 line-through group-hover:text-slate-600"
                : "text-slate-800 group-hover:text-teal-600"
            }`}
            onClick={() => {
              if (onToggleComplete) onToggleComplete(task.id);
            }}
            title="Klik untuk ubah status tugas"
          >
            {task.title}
          </h3>

          <button
            type="button"
            onClick={() => {
              if (onToggleComplete) onToggleComplete(task.id);
            }}
            title="Klik untuk mengubah status selesai"
            className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full shrink-0 transition-transform active:scale-95 cursor-pointer ${
              task.completed
                ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                : "bg-amber-50 text-amber-600 border border-amber-100"
            }`}
          >
            {task.completed ? "Completed" : "In Progress"}
          </button>
        </div>

        {/* Card Metadata / Sub-bullets */}
        <div className="text-xs text-slate-500 space-y-1 mb-4">
          <p className="flex items-center gap-1.5 text-slate-400">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
            <span>Task ID #{task.id}</span>
          </p>
          <p className="text-slate-400 text-[11px] truncate flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span>
            <span>Kategori: <strong className="text-slate-600 font-semibold">{task.category || "General"}</strong></span>
          </p>
        </div>
      </div>

      {/* Card Footer: Timestamp, Star & Action Menu */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] text-slate-500 font-medium">
            {task.createdAt || "Baru saja"}
          </span>
        </div>

        <div className="flex items-center gap-1 relative">
          {/* Star Bookmark Icon */}
          <button
            type="button"
            onClick={() => {
              if (onToggleStar) onToggleStar(task.id);
            }}
            className="p-1 hover:bg-slate-50 rounded-lg transition"
            title={task.starred ? "Hapus Bintang" : "Beri Bintang"}
          >
            <svg
              className={`w-4 h-4 transition ${
                task.starred
                  ? "text-amber-400 fill-amber-400"
                  : "text-slate-300 hover:text-amber-300"
              }`}
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </button>

          {/* Action Menu (•••) */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowMenu(!showMenu)}
              className="text-slate-300 hover:text-slate-600 font-bold tracking-widest px-1.5 py-0.5 rounded transition"
              title="Aksi Tugas"
            >
              •••
            </button>

            {/* Dropdown Menu */}
            {showMenu && (
              <div
                className="absolute right-0 bottom-full mb-1 w-36 bg-white border border-slate-100 rounded-xl shadow-lg py-1 z-20 animate-in fade-in zoom-in-95 duration-100"
                onMouseLeave={() => setShowMenu(false)}
              >
                <button
                  type="button"
                  onClick={() => {
                    if (onToggleComplete) onToggleComplete(task.id);
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 transition"
                >
                  {task.completed ? "Tandai Belum Selesai" : "Tandai Selesai"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (onDeleteTask) onDeleteTask(task.id);
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 transition font-medium"
                >
                  Hapus Tugas
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
