import React, { useState } from "react";

const COLOR_OPTIONS = [
  { label: "Teal", value: "bg-teal-50 text-teal-700 border-teal-200" },
  { label: "Indigo", value: "bg-indigo-50 text-indigo-700 border-indigo-200" },
  { label: "Purple", value: "bg-purple-50 text-purple-700 border-purple-200" },
  { label: "Amber", value: "bg-amber-50 text-amber-700 border-amber-200" },
  { label: "Rose", value: "bg-rose-50 text-rose-700 border-rose-200" },
  { label: "Emerald", value: "bg-emerald-50 text-emerald-700 border-emerald-200" },
];

export default function CategoryManager({ categories = [], onCategoryAdded, onCategoryDeleted }) {
  const [name, setName] = useState("");
  const [selectedColor, setSelectedColor] = useState(COLOR_OPTIONS[0].value);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setErrorMsg("Nama kategori wajib diisi.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");

    try {
      await onCategoryAdded({ name: trimmed, color: selectedColor });
      setName("");
    } catch (err) {
      setErrorMsg(err.message || "Gagal menambahkan kategori.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Manajemen Kategori</h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Kelola dan tambahkan label kategori untuk mengelompokkan catatan aktivitas Anda.
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs">
        <h3 className="text-sm font-semibold text-slate-800 mb-3">Tambah Kategori Baru</h3>
        
        {errorMsg && (
          <div className="mb-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs p-3 rounded-xl">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 items-start sm:items-end">
          <div className="flex-1 w-full">
            <label htmlFor="category-name" className="block text-xs font-medium text-slate-600 mb-1">
              Nama Kategori <span className="text-rose-500">*</span>
            </label>
            <input
              id="category-name"
              type="text"
              required
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errorMsg) setErrorMsg("");
              }}
              placeholder="Contoh: Frontend, Backend, Desain..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition"
            />
          </div>

          <div className="w-full sm:w-48">
            <label htmlFor="category-color" className="block text-xs font-medium text-slate-600 mb-1">
              Tema Warna
            </label>
            <select
              id="category-color"
              value={selectedColor}
              onChange={(e) => setSelectedColor(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition cursor-pointer"
            >
              {COLOR_OPTIONS.map((c) => (
                <option key={c.label} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto bg-[#1EBBA6] hover:bg-[#189e8c] text-white text-xs sm:text-sm font-medium px-5 py-2.5 rounded-xl transition shadow-xs disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? "Menyimpan..." : "Tambah Kategori"}
          </button>
        </form>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs">
        <h3 className="text-sm font-semibold text-slate-800 mb-3">
          Daftar Kategori Terdaftar ({categories.length})
        </h3>

        {categories.length === 0 ? (
          <div className="text-center py-10 text-slate-400 text-xs">
            Belum ada kategori yang dibuat. Gunakan formulir di atas untuk menambahkan kategori baru.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-slate-50 transition"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className={`px-2 py-0.5 rounded-md text-xs font-medium border truncate ${cat.color || "bg-slate-100 text-slate-700 border-slate-200"}`}>
                    {cat.name}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => onCategoryDeleted && onCategoryDeleted(cat.id)}
                  title={`Hapus kategori ${cat.name}`}
                  className="text-slate-400 hover:text-rose-600 p-1 rounded-lg hover:bg-white transition text-xs cursor-pointer"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
