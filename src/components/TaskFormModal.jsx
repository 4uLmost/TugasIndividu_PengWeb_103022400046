import React, { useState } from "react";

export default function TaskFormModal({ isOpen, onClose, onAddTask }) {
  // Controlled component states
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Internal");
  const [completed, setCompleted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim()) {
      setErrorMsg("Judul tugas wajib diisi!");
      return;
    }

    const newTask = {
      id: Date.now(),
      title: title.trim(),
      category,
      completed,
      createdAt: "Baru saja",
      starred: false,
    };

    onAddTask(newTask);

    // Reset state & close
    setTitle("");
    setCategory("Internal");
    setCompleted(false);
    setErrorMsg("");
    onClose();
  };

  const handleClose = () => {
    setTitle("");
    setCategory("Internal");
    setCompleted(false);
    setErrorMsg("");
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-150"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-100 space-y-5 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Tambahkan Catatan</h3>
            <p className="text-xs text-slate-400 mt-0.5">Tambahkan catatan baru ke dashboard.</p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="text-slate-400 hover:text-slate-700 font-bold p-1 rounded-lg hover:bg-slate-100 transition"
            title="Tutup Modal"
          >
            ✕
          </button>
        </div>

        {/* Controlled Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMsg && (
            <div className="bg-rose-50 text-rose-700 text-xs p-2.5 rounded-xl border border-rose-200">
              {errorMsg}
            </div>
          )}

          {/* Controlled Input: Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
              Judul Tugas (Title) <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Video Campaign Launch Strategy"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errorMsg) setErrorMsg("");
              }}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition text-slate-800 placeholder-slate-400"
            />
          </div>

          {/* Controlled Select: Category */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
              Kategori
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition text-slate-800 cursor-pointer"
            >
              <option value="Internal">Internal</option>
              <option value="Growth Hacking">Growth Hacking</option>
              <option value="Video Campaign">Video Campaign</option>
              <option value="Product Marketing">Product Marketing</option>
              <option value="Design & Prototype">Design & Prototype</option>
            </select>
          </div>

          {/* Controlled Checkbox: Completed Status */}
          <div className="flex items-center gap-2.5 pt-1">
            <input
              type="checkbox"
              id="statusComplete"
              checked={completed}
              onChange={(e) => setCompleted(e.target.checked)}
              className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500 border-slate-300 cursor-pointer"
            />
            <label htmlFor="statusComplete" className="text-xs font-medium text-slate-700 cursor-pointer select-none">
              Tandai langsung sebagai <strong>Selesai (Completed)</strong>
            </label>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-[#1EBBA6] hover:bg-[#189e8c] active:scale-95 rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
            >
              <span>+ Simpan Tugas</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

