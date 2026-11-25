/* oxlint-disable react/set-state-in-effect */
import React, { useState, useEffect, useMemo } from "react";

export default function TaskFormModal({
  isOpen,
  onClose,
  onAddTask,
  onUpdateTask,
  editingTask = null,
  categories = [],
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [completed, setCompleted] = useState(false);
  const [subtasks, setSubtasks] = useState([]);
  const [subtaskInput, setSubtaskInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const availableCategories = useMemo(
    () => categories.map((c) => c.name),
    [categories]
  );

  // Form hanya diinisialisasi saat modal dibuka atau task yang diedit berganti
  // oxlint-disable-next-line react/set-state-in-effect, react-hooks/exhaustive-deps
  useEffect(() => {
    if (!isOpen) return;

    if (editingTask) {
      setTitle(editingTask.title || "");
      setDescription(editingTask.description || "");
      const matchedCategory =
        editingTask.category && availableCategories.includes(editingTask.category)
          ? editingTask.category
          : availableCategories[0] || "";
      setCategory(matchedCategory);
      setCompleted(Boolean(editingTask.completed));
      setSubtasks(
        editingTask.subtasks
          ? editingTask.subtasks.map((st) => ({
              id: st.id || Math.random(),
              text: st.text,
              completed: Boolean(st.completed),
            }))
          : []
      );
    } else {
      setTitle("");
      setDescription("");
      setCategory(availableCategories[0] || "");
      setCompleted(false);
      setSubtasks([]);
    }
    setSubtaskInput("");
    setErrorMsg("");
    // oxlint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, editingTask]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen && !isSubmitting) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isSubmitting, onClose]);

  if (!isOpen) return null;

  const handleAddSubtask = (e) => {
    e.preventDefault();
    const trimmed = subtaskInput.trim();
    if (!trimmed) return;
    setSubtasks((prev) => [
      ...prev,
      { id: Date.now(), text: trimmed, completed: false },
    ]);
    setSubtaskInput("");
  };

  const handleRemoveSubtask = (id) => {
    setSubtasks((prev) => prev.filter((s) => s.id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      setErrorMsg("Judul catatan wajib diisi.");
      return;
    }

    const selectedCategory = category || availableCategories[0] || "General";

    setIsSubmitting(true);
    setErrorMsg("");

    const payload = {
      title: title.trim(),
      description: description.trim() || undefined,
      category: selectedCategory,
      completed,
      subtasks: subtasks.map((s) => ({
        text: s.text,
        completed: Boolean(s.completed),
      })),
    };

    try {
      if (editingTask) {
        await onUpdateTask(editingTask.id, payload);
      } else {
        await onAddTask(payload);
      }
      onClose();
    } catch (err) {
      setErrorMsg(err.message || "Gagal menyimpan catatan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="task-modal-title"
      className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto"
      onClick={() => {
        if (!isSubmitting) onClose();
      }}
    >
      <div
        className="bg-white rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-xl border border-slate-100 space-y-4 my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div>
            <h3 id="task-modal-title" className="text-lg font-bold text-slate-900">
              {editingTask ? "Edit Catatan" : "Tambahkan Catatan"}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {editingTask
                ? "Perbarui rincian, kategori, atau subtask catatan."
                : "Tambahkan catatan baru beserta rincian dan subtask."}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="text-slate-400 hover:text-slate-700 font-bold p-1 rounded-lg hover:bg-slate-100 transition cursor-pointer"
            title="Tutup Modal"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {errorMsg && (
            <div className="bg-rose-50 text-rose-700 text-xs p-2.5 rounded-xl border border-rose-200">
              {errorMsg}
            </div>
          )}

          <div>
            <label htmlFor="task-title" className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wide">
              Judul Catatan <span className="text-rose-500">*</span>
            </label>
            <input
              id="task-title"
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

          <div>
            <label htmlFor="task-desc" className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wide">
              Deskripsi Catatan
            </label>
            <textarea
              id="task-desc"
              rows={3}
              placeholder="Tuliskan deskripsi atau rincian catatan..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition text-slate-800 placeholder-slate-400 resize-none"
            />
          </div>

          <div>
            <label htmlFor="task-subtask-input" className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wide">
              Subtask
            </label>
            <div className="flex items-center gap-2">
              <input
                id="task-subtask-input"
                type="text"
                placeholder="Tambahkan subtask..."
                value={subtaskInput}
                onChange={(e) => setSubtaskInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddSubtask(e);
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

          <div>
            <label htmlFor="task-category" className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wide">
              Kategori
            </label>
            {availableCategories.length === 0 ? (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800 space-y-1">
                <p className="font-semibold">Kategori masih kosong.</p>
                <p className="text-amber-700">
                  Silakan buat kategori baru melalui menu <strong>Kategori</strong> di sidebar samping.
                </p>
              </div>
            ) : (
              <select
                id="task-category"
                value={category || availableCategories[0] || ""}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition text-slate-800 cursor-pointer"
              >
                {availableCategories.map((catName) => (
                  <option key={catName} value={catName}>
                    {catName}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="flex items-center gap-2.5 pt-1">
            <input
              type="checkbox"
              id="task-complete"
              checked={completed}
              onChange={(e) => setCompleted(e.target.checked)}
              className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500 border-slate-300 cursor-pointer"
            />
            <label htmlFor="task-complete" className="text-xs font-medium text-slate-700 cursor-pointer select-none">
              Tandai langsung sebagai <strong>Selesai (Completed)</strong>
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
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
                  <span>Menyimpan...</span>
                </>
              ) : (
                <span>{editingTask ? "Simpan Perubahan" : "+ Simpan Catatan"}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
