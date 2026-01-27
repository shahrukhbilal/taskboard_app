"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation"; // Next.js App Router


// Helper functions for badges
const getStatusColor = (status) => {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-800";
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "upcoming":
      return "bg-blue-100 text-blue-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getPriorityColor = (priority) => {
  switch (priority) {
    case "high":
      return "bg-red-100 text-red-800";
    case "medium":
      return "bg-yellow-100 text-yellow-800";
    case "low":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export default function TasksPage() {
    const router = useRouter();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await fetch("/api/tasks");
        const data = await res.json();
        setTasks(Array.isArray(data.tasks) ? data.tasks : []);
      } catch (error) {
        console.error("Failed to fetch tasks", error);
        setTasks([]);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  const handleDelete = async (taskId) => {
    try {
      const res = await fetch(`/api/tasks/${taskId}`, { method: "DELETE" });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Delete failed");

      // Optimistic UI update
      setTasks((prev) => prev.filter((t) => t._id !== taskId));

      setSuccessMessage("Task deleted successfully");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error(error);
      alert("Failed to delete task");
    }
  };

  return (
    <div className="p-6">
        <div className="mb-6 flex items-center gap-4">
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={() => router.push("/dashboard/admindashboard")} // Adjust path to your dashboard
    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
  >
    ← Back to Dashboard
  </motion.button>

  <h1 className="text-3xl font-bold">All Tasks</h1>
</div>

      <h1 className="text-3xl font-bold mb-6">All Tasks</h1>

      {successMessage && (
        <div className="mb-4 rounded bg-green-100 text-green-800 px-4 py-2">
          {successMessage}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-44 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : (
        <AnimatePresence>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {tasks.map((task) => (
              <motion.div
                key={task._id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                layout
                whileHover={{ scale: 1.03, boxShadow: "0 8px 20px rgba(0,0,0,0.15)" }}
                className="border rounded-xl p-6 shadow-sm bg-gray-200 flex flex-col justify-between"
              >
                <div>
                  <h2 className="text-xl font-semibold mb-2 truncate">{task.title}</h2>

                  <p className="text-sm text-gray-600 mb-1">
                    Assigned To:{" "}
                    <span className="font-medium">{task.assignedTo?.name || "Unassigned"}</span>
                  </p>

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

                  <p className="text-sm mt-2 text-gray-500">
                    Due:{" "}
                    <span className="font-medium">
                      {task.due ? new Date(task.due).toLocaleDateString() : "No due date"}
                    </span>
                  </p>
                </div>

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
