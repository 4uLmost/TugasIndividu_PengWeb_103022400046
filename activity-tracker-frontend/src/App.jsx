import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import HeaderWorkspace from "./components/HeaderWorkspace";
import TaskList from "./components/TaskList";
import TaskSummary from "./components/TaskSummary";
import TaskFormModal from "./components/TaskFormModal";
import CategoryManager from "./components/CategoryManager";

const API_BASE_URL = "http://localhost:3000/tasks";
const CATEGORIES_API_URL = "http://localhost:3000/categories";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  const [activeNav, setActiveNav] = useState("dashboard"); // 'dashboard' | 'starred' | 'categories'
  const [filter, setFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const fetchTasks = async (statusFilter = filter) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const url =
        statusFilter && statusFilter !== "all"
          ? `${API_BASE_URL}?status=${statusFilter}`
          : API_BASE_URL;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Gagal memuat data dari server (HTTP ${response.status}).`);
      }

      const data = await response.json();
      setTasks(data);
    } catch (error) {
      setErrorMessage(
        error.message || "Gagal menghubungi server NestJS & PostgreSQL."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch(CATEGORIES_API_URL);
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch {
      // Backend mungkin belum running atau offline
    }
  };

  useEffect(() => {
    // oxlint-disable-next-line react/set-state-in-effect
    fetchTasks();
    fetchCategories();
  }, []);

  const handleFilterChange = (selectedFilter) => {
    setFilter(selectedFilter);
    fetchTasks(selectedFilter);
  };

  const handleAddTask = async (newTaskData) => {
    try {
      const response = await fetch(API_BASE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: newTaskData.title,
          description: newTaskData.description || undefined,
          category: newTaskData.category || "Internal",
          completed: newTaskData.completed ?? false,
          starred: newTaskData.starred ?? false,
          subtasks: newTaskData.subtasks?.map((st) => ({
            text: st.text,
            completed: st.completed ?? false,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error(`Gagal menyimpan data ke server (HTTP ${response.status}).`);
      }

      const createdTask = await response.json();
      setTasks((prev) => [createdTask, ...prev]);
    } catch (error) {
      throw new Error(error.message || "Gagal menyimpan catatan ke basis data.");
    }
  };

  const handleUpdateTask = async (taskId, updatedData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${taskId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        throw new Error(`Gagal memperbarui data di server (HTTP ${response.status}).`);
      }

      const updatedTask = await response.json();
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? updatedTask : t))
      );
    } catch (error) {
      throw new Error(error.message || "Gagal memperbarui catatan.");
    }
  };

  const handleToggleComplete = async (taskId) => {
    const current = tasks.find((t) => t.id === taskId);
    if (!current) return;

    const nextCompleted = !current.completed;
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, completed: nextCompleted } : t))
    );

    try {
      await fetch(`${API_BASE_URL}/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: nextCompleted }),
      });
    } catch {
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, completed: current.completed } : t))
      );
    }
  };

  const handleToggleStar = async (taskId) => {
    const current = tasks.find((t) => t.id === taskId);
    if (!current) return;

    const nextStarred = !current.starred;
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, starred: nextStarred } : t))
    );

    try {
      await fetch(`${API_BASE_URL}/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ starred: nextStarred }),
      });
    } catch {
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, starred: current.starred } : t))
      );
    }
  };

  const handleDeleteTask = async (taskId) => {
    const prevTasks = [...tasks];
    setTasks((prev) => prev.filter((t) => t.id !== taskId));

    try {
      const res = await fetch(`${API_BASE_URL}/${taskId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
    } catch {
      setTasks(prevTasks);
      alert("Gagal menghapus tugas dari database server.");
    }
  };

  const handleEditClick = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleAddCategory = async ({ name, color }) => {
    const res = await fetch(CATEGORIES_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, color }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "Gagal membuat kategori.");
    }

    const created = await res.json();
    setCategories((prev) => [...prev, created]);
  };

  const handleDeleteCategory = async (id) => {
    try {
      const res = await fetch(`${CATEGORIES_API_URL}/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
      setCategories((prev) => prev.filter((c) => c.id !== id));
    } catch {
      alert("Gagal menghapus kategori.");
    }
  };

  const pageTitle = (() => {
    if (activeNav === "starred") return "Catatan Berbintang";
    if (activeNav === "categories") return "Kategori";
    return "Projects";
  })();

  const displayedTasks =
    activeNav === "starred" ? tasks.filter((t) => t.starred) : tasks;

  return (
    <div className="min-h-screen w-full bg-slate-50 flex flex-col lg:flex-row">
      <Sidebar activeNav={activeNav} onNavChange={setActiveNav} />

      <main className="flex-1 bg-[#F9FAFC] flex flex-col p-6 sm:p-8 min-w-0">
        <HeaderWorkspace
          title={pageTitle}
          onOpenModal={() => {
            setEditingTask(null);
            setIsModalOpen(true);
          }}
        />

        <div className="flex-1 mt-6">
          {activeNav === "categories" ? (
            <CategoryManager
              categories={categories}
              onCategoryAdded={handleAddCategory}
              onCategoryDeleted={handleDeleteCategory}
            />
          ) : (
            <TaskList
              tasks={displayedTasks}
              isLoading={isLoading}
              errorMessage={errorMessage}
              onRetry={() => fetchTasks(filter)}
              filter={filter}
              onFilterChange={handleFilterChange}
              onToggleComplete={handleToggleComplete}
              onDeleteTask={handleDeleteTask}
              onToggleStar={handleToggleStar}
              onEdit={handleEditClick}
            />
          )}
        </div>
      </main>

      <TaskSummary tasks={tasks} user="Dhiyaul" />

      <TaskFormModal
        isOpen={isModalOpen}
        editingTask={editingTask}
        categories={categories}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTask(null);
        }}
        onAddTask={handleAddTask}
        onUpdateTask={handleUpdateTask}
      />
    </div>
  );
}
