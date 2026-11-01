import React, { useState } from "react";

export default function TaskFormModal({ isOpen, onClose, onAddTask }) {
  // Controlled component states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Internal");
  const [completed, setCompleted] = useState(false);
  const [subtasks, setSubtasks] = useState([]);
  const [subtaskInput, setSubtaskInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  if (!isOpen) return null;

  // Tambah subtask ke daftar sementara
  const handleAddSubtask = (e) => {
    e.preventDefault();
    if (!subtaskInput.trim()) return;
    setSubtasks((prev) => [
      ...prev,
      { id: Date.now(), text: subtaskInput.trim(), completed: false },
    ]);
    setSubtaskInput("");
  };

  // Hapus subtask dari daftar sementara
  const handleRemoveSubtask = (id) => {
    setSubtasks((prev) => prev.filter((s) => s.id !== id));
  };

  // Submit form dengan async POST handling
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      setErrorMsg("Judul catatan wajib diisi!");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");

    try {
      // oxlint-disable-next-line react/purity
      const newId = Date.now();
      const newTask = {
        id: newId,
        title: title.trim(),
        description: description.trim(),
        subtasks: [...subtasks],
        category,
        completed,
        createdAt: "Baru saja",
        starred: false,
      };

      await onAddTask(newTask);

      // Reset state & close
      resetForm();
      onClose();
    } catch (err) {
      setErrorMsg(err.message || "Gagal menyimpan catatan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setCategory("Internal");
    setCompleted(false);
    setSubtasks([]);
    setSubtaskInput("");
    setIsSubmitting(false);
    setErrorMsg("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-150 overflow-y-auto"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-2xl border border-slate-100 space-y-4 my-8 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Tambahkan Catatan</h3>
            <p className="text-xs text-slate-400 mt-0.5">Tambahkan catatan baru beserta rincian dan subtask.</p>
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
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {errorMsg && (
            <div className="bg-rose-50 text-rose-700 text-xs p-2.5 rounded-xl border border-rose-200">
              {errorMsg}
            </div>
          )}

          {/* Controlled Input: Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wide">
              Judul Catatan <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Rencana Peluncuran Proyek"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errorMsg) setErrorMsg("");
              }}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition text-slate-800 placeholder-slate-400"
            />
          </div>

          {/* Controlled Textarea: Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wide">
              Deskripsi Catatan
            </label>
            <textarea
              rows={3}
              placeholder="Tuliskan deskripsi atau rincian catatan..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition text-slate-800 placeholder-slate-400 resize-none"
            />
          </div>

          {/* Controlled Subtask Input & List */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wide">
              Subtask
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Tambahkan subtask..."
                value={subtaskInput}
                onChange={(e) => setSubtaskInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    if (subtaskInput.trim()) {
                      setSubtasks((prev) => [
                        ...prev,
                        { id: Date.now(), text: subtaskInput.trim(), completed: false },
                      ]);
                      setSubtaskInput("");
                    }
                  }
                }}
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition text-slate-800 placeholder-slate-400"
              />
              <button
                type="button"
                onClick={handleAddSubtask}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition cursor-pointer"
              >
                + Tambah
              </button>
            </div>

            {/* Subtasks List */}
            {subtasks.length > 0 && (
              <div className="mt-2 space-y-1.5 max-h-28 overflow-y-auto pr-1">
                {subtasks.map((st) => (
                  <div
                    key={st.id}
                    className="flex items-center justify-between bg-slate-50 border border-slate-200/80 rounded-lg px-2.5 py-1.5 text-xs text-slate-700"
                  >
                    <span className="truncate">• {st.text}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSubtask(st.id)}
                      className="text-slate-400 hover:text-rose-500 ml-2 font-bold cursor-pointer"
                      title="Hapus Subtask"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Controlled Select: Category */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wide">
              Kategori
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition text-slate-800 cursor-pointer"
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
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 text-xs font-bold text-white bg-[#1EBBA6] hover:bg-[#189e8c] active:scale-95 disabled:opacity-60 rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Menyimpan (POST)...</span>
                </>
              ) : (
                <span>+ Simpan Catatan</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
