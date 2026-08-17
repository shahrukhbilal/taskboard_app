"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Bell, Sun, Moon, Plus, Menu } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

// ✅ TaskModal extracted for readability
function TaskModal({
  modalOpen,
  setModalOpen,
  title,
  setTitle,
  description,
  setDescription,
  assignedTo,
  setAssignedTo,
  priority,
  setPriority,
  status,
  setStatus,
  due,
  setDue,
  employees,
}) {
  const handleCreateTask = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, priority, assignedTo, status, due }),
      });

      if (!res.ok) throw new Error("Task not created");

      setModalOpen(false);
      setTitle("");
      setStatus("todo");
      setDue("");
      setAssignedTo("");
      setDescription("");
      setPriority("medium");

      toast.success("Task created successfully!");
      window.location.reload(); // same functionality as before
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to create task");
    }
  };

  // Prevent scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = modalOpen ? "hidden" : "auto";
  }, [modalOpen]);

  return (
    <AnimatePresence>
      {modalOpen && (
        <motion.div
          key="taskModal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-white dark:bg-gray-900 p-6 rounded-2xl w-96 shadow-xl border border-gray-200 dark:border-gray-700"
          >
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
              Assign New Task
            </h2>

            <form onSubmit={handleCreateTask} className="space-y-4">
              {/* Title */}
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-300">Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white outline-none"
                />
              </div>

              {/* Description */}
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-300">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows="3"
                  className="w-full mt-1 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white outline-none"
                />
              </div>

              {/* Assign To */}
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-300">Assign To</label>
                <select
                  value={assignedTo}
                  onChange={(e) => setAssignedTo(e.target.value)}
                  required
                  className="w-full mt-1 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white outline-none"
                >
                  <option value="">Select Employee</option>
                  {employees.map((emp) => (
                    <option key={emp._id} value={emp._id}>
                      {emp.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Priority */}
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-300">Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white outline-none"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              {/* Status */}
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-300">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white outline-none"
                >
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </div>

              {/* Due Date */}
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-300">Due Date</label>
                <input
                  type="date"
                  value={due}
                  onChange={(e) => setDue(e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white outline-none"
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                >
                  Assign Task
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function Navbar({ toggleSidebar }) {
  const router = useRouter();

  // Theme
  const [darkMode, setDarkMode] = useState(false);

  // Avatar menu
  const [menuOpen, setMenuOpen] = useState(false);

  // Task modal
  const [modalOpen, setModalOpen] = useState(false);

  // Form states
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("todo");
  const [due, setDue] = useState("");
  const [employees, setEmployees] = useState([]);
  const [assignedTo, setAssignedTo] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");

  // Logout handler
  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Logout API failed");

      toast.success("Logged out successfully!");
      router.push("/auth/login");
    } catch (error) {
      console.error(error);
      toast.error("Logout failed");
    }
  };

  // Fetch employees once
  useEffect(() => {
    async function fetchEmployees() {
      try {
        const res = await fetch("/api/admin/employees");
        const data = await res.json();
        setEmployees(data.employees);
      } catch (err) {
        console.error(err);
      }
    }
    fetchEmployees();
  }, []);

  // Load theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    document.documentElement.classList.toggle("dark");
    localStorage.setItem("theme", newMode ? "dark" : "light");
  };

  // Close avatar menu on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (!e.target.closest(".profile-menu")) setMenuOpen(false);
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return (
    <>
      {/* NAVBAR */}
      <nav className="flex items-center justify-between px-6 py-3 bg-white dark:bg-gray-900 shadow-md fixed top-0 w-full z-50 transition-colors duration-300">
        {/* Sidebar toggle */}
        <button
          onClick={toggleSidebar}
          className="lg:hidden text-gray-700 dark:text-gray-200 p-2 rounded-md mr-2"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="relative w-8 h-8">
            <Image src="/logo.jpeg" alt="TaskFlow logo" fill className="object-contain" sizes="32px" priority />
          </div>
          <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100">TaskBoard</h1>
        </div>

        {/* Search */}
        <div className="hidden md:flex flex-1 mx-6">
          <input
            type="text"
            placeholder="Search tasks..."
            className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none text-gray-800 dark:text-gray-100"
          />
        </div>

        {/* Right Icons */}
        <div className="flex items-center space-x-4">
          <button onClick={toggleDarkMode} className="text-gray-600 dark:text-gray-300 hover:text-blue-600 transition">
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          <button className="relative text-gray-600 dark:text-gray-300 hover:text-blue-600 transition">
            <Bell className="w-5 h-5" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            <Plus className="w-4 h-4" /> New Task
          </button>

          {/* Avatar */}
          <div className="relative profile-menu">
            <div
              onClick={() => setMenuOpen(!menuOpen)}
              className="relative w-9 h-9 cursor-pointer rounded-full border hover:ring-2 hover:ring-blue-500 transition"
            >
              <Image src="/newProfile.png" alt="User avatar" fill className="object-cover rounded-full" sizes="36px" />
            </div>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-2">
                <a className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">Profile</a>
                <a className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">Settings</a>
                <button onClick={handleLogout} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Task Modal */}
      <TaskModal
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        title={title}
        setTitle={setTitle}
        description={description}
        setDescription={setDescription}
        assignedTo={assignedTo}
        setAssignedTo={setAssignedTo}
        priority={priority}
        setPriority={setPriority}
        status={status}
        setStatus={setStatus}
        due={due}
        setDue={setDue}
        employees={employees}
      />
    </>
  );
}
