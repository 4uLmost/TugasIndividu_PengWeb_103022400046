import React, { useState } from "react";
import { initialTasks } from "./data/initialTasks";
import Sidebar from "./components/Sidebar";
import HeaderWorkspace from "./components/HeaderWorkspace";
import TaskList from "./components/TaskList";
import TaskSummary from "./components/TaskSummary";
import TaskFormModal from "./components/TaskFormModal";

export default function App() {
  // State daftar tugas lokal (awal kosong)
  const [tasks, setTasks] = useState(initialTasks);

  // UI state untuk navigasi dan modal
  const [activeNav, setActiveNav] = useState("dashboard");
  const [filter, setFilter] = useState("all"); // 'all' | 'in-progress' | 'completed'
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Handler: Tambah tugas baru ke state array (Controlled Form)
  const handleAddTask = (newTask) => {
    setTasks((prevTasks) => [newTask, ...prevTasks]);
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

      {/* 4. Modal Dialog Form */}
      <TaskFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddTask={handleAddTask}
      />
    </div>
  );
}
