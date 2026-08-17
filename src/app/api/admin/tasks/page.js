"use client"; // Required for using hooks & browser APIs in Next.js App Router

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation"; // Used for client-side navigation in App Router

// 🎨 Helper: Returns badge color classes based on task status
// Keeps the JSX clean and avoids inline conditional clutter
const getStatusColor = (status) => {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-800";
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "upcoming":
      return "bg-blue-100 text-blue-800";
    default:
      return "bg-gray-100 text-gray-800"; // fallback color
  }
};

// 🎯 Helper: Returns badge color classes based on task priority
// Makes it easy to visually differentiate high, medium, low priority tasks
const getPriorityColor = (priority) => {
  switch (priority) {
    case "high":
      return "bg-red-100 text-red-800";
    case "medium":
      return "bg-yellow-100 text-yellow-800";
    case "low":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800"; // fallback color
  }
};

export default function TasksPage() {
  const router = useRouter(); // Allows navigation back to dashboard

  // 🧠 State to store the list of tasks fetched from backend
  const [tasks, setTasks] = useState([]);

  // ⏳ Loading state to show skeleton placeholders while fetching data
  const [loading, setLoading] = useState(true);

  // ✅ Success message state, e.g., after deleting a task
  const [successMessage, setSuccessMessage] = useState("");

  // 📡 Fetch tasks once on component mount
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await fetch("/api/tasks");
        const data = await res.json();

        // Ensure we always get an array to avoid UI crashes
        setTasks(Array.isArray(data.tasks) ? data.tasks : []);
      } catch (error) {
        console.error("Failed to fetch tasks", error);
        setTasks([]); // fallback to empty array on error
      } finally {
        setLoading(false); // stop loading indicator in any case
      }
    };

    fetchTasks();
  }, []);

  // 🗑️ Handler to delete a task by its ID
  const handleDelete = async (taskId) => {
    try {
      const res = await fetch(`/api/tasks/${taskId}`, { method: "DELETE" });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Delete failed");

      // ⚡ Optimistic UI update: remove task immediately from UI
      setTasks((prev) => prev.filter((t) => t._id !== taskId));

      // 🎉 Show temporary success feedback
      setSuccessMessage("Task deleted successfully");
      setTimeout(() => setSuccessMessage(""), 3000); // auto-hide after 3s
    } catch (error) {
      console.error(error);
      alert("Failed to delete task"); // simple error feedback
    }
  };

  return (
    <div className="p-6">
      {/* 🔙 Back button + page heading */}
      <div className="mb-6 flex items-center gap-4">
        <motion.button
          whileHover={{ scale: 1.05 }} // subtle hover animation
          whileTap={{ scale: 0.95 }}  // subtle tap animation
          onClick={() => router.push("/dashboard/admindashboard")}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
        >
          ← Back to Dashboard
        </motion.button>

        <h1 className="text-3xl font-bold">All Tasks</h1>
      </div>

      {/* ✅ Success feedback banner */}
      {successMessage && (
        <div className="mb-4 rounded bg-green-100 text-green-800 px-4 py-2">
          {successMessage}
        </div>
      )}

      {/* ⏳ Show skeleton loaders while tasks are loading */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-44 bg-gray-100 rounded-xl animate-pulse"
            />
          ))}
        </div>
      ) : (
        // 🧩 AnimatePresence wraps items for smooth enter/exit animations
        <AnimatePresence>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {tasks.map((task) => (
              <motion.div
                key={task._id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }} // initial animation
                animate={{ opacity: 1, y: 0, scale: 1 }}    // animate in
                exit={{ opacity: 0, y: -20, scale: 0.95 }}  // animate out
                layout // smooth layout transitions
                whileHover={{
                  scale: 1.03,
                  boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
                }}
                className="border rounded-xl p-6 shadow-sm bg-gray-200 flex flex-col justify-between"
              >
                <div>
                  {/* 📝 Task title */}
                  <h2 className="text-xl font-semibold mb-2 truncate">
                    {task.title}
                  </h2>

                  {/* 👤 Assigned user */}
                  <p className="text-sm text-gray-600 mb-1">
                    Assigned To:{" "}
                    <span className="font-medium">
                      {task.assignedTo?.name || "Unassigned"}
                    </span>
                  </p>

                  {/* 🏷️ Status & Priority badges */}
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                        task.status
                      )}`}
                    >
                      {task.status}
                    </span>

                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(
                        task.priority
                      )}`}
                    >
                      {task.priority}
                    </span>
                  </div>

                  {/* 📅 Due date display */}
                  <p className="text-sm mt-2 text-gray-500">
                    Due:{" "}
                    <span className="font-medium">
                      {task.due
                        ? new Date(task.due).toLocaleDateString()
                        : "No due date"}
                    </span>
                  </p>
                </div>

                {/* ❌ Delete button */}
                <button
                  onClick={() => handleDelete(task._id)}
                  className="mt-4 w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-colors"
                >
                  Delete Task
                </button>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
      )}
    </div>
  );
}
