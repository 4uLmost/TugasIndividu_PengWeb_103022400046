import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import HeaderWorkspace from "./components/HeaderWorkspace";
import TaskList from "./components/TaskList";
import TaskSummary from "./components/TaskSummary";
import TaskFormModal from "./components/TaskFormModal";

export default function App() {
  // State Triplet untuk AJAX & Status Jaringan (Tugas 7)
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  // UI state untuk navigasi, modal, dan filter
  const [activeNav, setActiveNav] = useState("dashboard");
  const [filter, setFilter] = useState("all"); // 'all' | 'in-progress' | 'completed'
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fungsi AJAX GET untuk mengambil data tugas dari JSONPlaceholder
  const fetchTasks = async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      // URL endpoint API JSONPlaceholder
      const endpoint = "https://jsonplaceholder.typicode.com/todos?_limit=5";
      const response = await fetch(endpoint);

      if (!response.ok) {
        throw new Error(
          `Gagal memuat data dari server (HTTP status: ${response.status}).`
        );
      }

      const data = await response.json();

      // Transformasi data API ke format entitas aplikasi
      const formattedTasks = data.map((item) => ({
        id: item.id,
        title: item.title,
        description: "",
        subtasks: [],
        category: item.id % 2 === 0 ? "Internal" : "Product Marketing",
        completed: item.completed,
        createdAt: "Dari Server",
        starred: false,
      }));

      setTasks(formattedTasks);
    } catch (error) {
      setErrorMessage(
        error.message || "Terjadi kesalahan saat menghubungi API eksternal."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Muat data pertama kali saat aplikasi dibuka
  useEffect(() => {
    // oxlint-disable-next-line react/set-state-in-effect
    fetchTasks();
  }, []);

  // Handler: AJAX POST untuk menambahkan tugas baru ke JSONPlaceholder
  const handleAddTask = async (newTaskData) => {
    try {
      const response = await fetch("https://jsonplaceholder.typicode.com/todos", {
        method: "POST",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
        body: JSON.stringify({
          title: newTaskData.title,
          completed: newTaskData.completed,
          userId: 1,
        }),
      });

      if (!response.ok) {
        throw new Error(`Gagal mengirim data (HTTP ${response.status})`);
      }

      const created = await response.json();

      // Tambahkan data baru ke state lokal di urutan teratas
      const finalTask = {
        ...newTaskData,
        id: created.id ? Number(created.id) + Date.now() : Date.now(),
      };

      setTasks((prevTasks) => [finalTask, ...prevTasks]);
    } catch (error) {
      throw new Error(error.message || "Gagal menyimpan catatan ke server.");
    }
  };

  // Handler: Toggle status selesai tugas
  const handleToggleComplete = (taskId) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // Handler: Toggle bookmark bintang
  const handleToggleStar = (taskId) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, starred: !task.starred } : task
      )
    );
  };

  // Handler: Hapus satu tugas
  const handleDeleteTask = (taskId) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 flex flex-col lg:flex-row">
      {/* 1. Micro Sidebar Navigation (Zone A) */}
      <Sidebar activeNav={activeNav} onNavChange={setActiveNav} />

      {/* 2. Area Kerja Utama (Zone B) */}
      <main className="flex-1 bg-[#F9FAFC] flex flex-col p-6 sm:p-8 min-w-0">
        <HeaderWorkspace onOpenModal={() => setIsModalOpen(true)} />

        <div className="flex-1 mt-6">
          <TaskList
            tasks={tasks}
            isLoading={isLoading}
            errorMessage={errorMessage}
            onRetry={fetchTasks}
            filter={filter}
            onFilterChange={setFilter}
            onToggleComplete={handleToggleComplete}
            onDeleteTask={handleDeleteTask}
            onToggleStar={handleToggleStar}
          />
        </div>
      </main>

      {/* 3. TaskSummary & Metrik 2x2 (Zone C) */}
      <TaskSummary tasks={tasks} user="Dhiyaul" />

      {/* 4. Modal Dialog Form (dengan AJAX POST) */}
      <TaskFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddTask={handleAddTask}
      />
    </div>
  );
}
