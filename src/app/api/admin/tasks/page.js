"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

// 🎨 Helper: Status badge colors
const getStatusColor = (status) => {
  switch (status) {
    case "completed":
      return "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400";

    case "pending":
      return "bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";

    case "upcoming":
      return "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";

    default:
      return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
  }
};

// 🎯 Helper: Priority badge colors
const getPriorityColor = (priority) => {
  switch (priority) {
    case "high":
      return "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400";

    case "medium":
      return "bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";

    case "low":
      return "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400";

    default:
      return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
  }
};

export default function TasksPage() {
  const router = useRouter();

  // 🧠 Store tasks
  const [tasks, setTasks] = useState([]);

  // ⏳ Loading state
  const [loading, setLoading] = useState(true);

  // ✅ Success message
  const [successMessage, setSuccessMessage] = useState("");

  // 📡 Fetch tasks
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await fetch("/api/tasks");

        if (!res.ok) {
          throw new Error("Failed to fetch tasks");
        }

        const data = await res.json();

        // Ensure we always get an array
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

  // 🗑️ Delete task
  const handleDelete = async (taskId) => {
    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Delete failed");
      }

      // ⚡ Remove task from UI
      setTasks((prev) => prev.filter((task) => task._id !== taskId));

      // 🎉 Success message
      setSuccessMessage("Task deleted successfully");

      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (error) {
      console.error(error);
      alert("Failed to delete task");
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50 dark:bg-gray-950 text-gray-800 dark:text-gray-100">

      {/* 🔙 Header */}
      <div className="mb-6 flex items-center gap-4">

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => router.push("/dashboard/admindashboard")}
          className="
            px-4 py-2
            rounded-xl
            bg-gray-200 dark:bg-gray-800
            text-gray-800 dark:text-gray-100
            hover:bg-gray-300 dark:hover:bg-gray-700
            transition-colors
          "
        >
          ← Back to Dashboard
        </motion.button>

        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800 dark:text-gray-100">
            All Tasks
          </h1>

          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage and monitor all tasks
          </p>
        </div>
      </div>

      {/* ✅ Success Message */}
      {successMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="
            mb-6
            rounded-2xl
            border border-green-200 dark:border-green-800
            bg-green-50 dark:bg-green-900/30
            text-green-700 dark:text-green-400
            px-4 py-3
          "
        >
          {successMessage}
        </motion.div>
      )}

      {/* ⏳ Loading */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

          {[...Array(8)].map((_, index) => (
            <div
              key={index}
              className="
                h-52
                rounded-2xl
                bg-gray-100 dark:bg-gray-900
                border border-gray-200 dark:border-gray-800
                animate-pulse
              "
            />
          ))}

        </div>
      ) : tasks.length === 0 ? (

        /* 📭 Empty State */
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="
            flex flex-col items-center justify-center
            min-h-[300px]
            rounded-2xl
            bg-white dark:bg-gray-900
            border border-gray-200 dark:border-gray-800
            shadow-sm
          "
        >
          <div className="text-5xl mb-4">📋</div>

          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            No Tasks Found
          </h2>

          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            There are currently no tasks available.
          </p>
        </motion.div>

      ) : (

        /* 🧩 Tasks */
        <AnimatePresence>
          <div
            className="
              grid
              grid-cols-1
              sm:grid-cols-2
              lg:grid-cols-3
              xl:grid-cols-4
              gap-4 sm:gap-6
            "
          >

            {tasks.map((task) => (

              <motion.div
                key={task._id}

                initial={{
                  opacity: 0,
                  y: 20,
                  scale: 0.95,
                }}

                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                }}

                exit={{
                  opacity: 0,
                  y: -20,
                  scale: 0.95,
                }}

                layout

                whileHover={{
                  scale: 1.03,
                  boxShadow: "0 10px 20px rgba(0,0,0,0.10)",
                }}

                className="
                  border
                  border-gray-200 dark:border-gray-800

                  bg-white dark:bg-gray-900

                  rounded-2xl
                  p-5 sm:p-6

                  shadow-sm

                  flex
                  flex-col
                  justify-between

                  transition-all
                  duration-300
                "
              >

                {/* 📝 Task Information */}
                <div>

                  {/* Task Title */}
                  <h2
                    className="
                      text-lg sm:text-xl
                      font-semibold
                      mb-3
                      truncate
                      text-gray-800 dark:text-gray-100
                    "
                  >
                    {task.title}
                  </h2>

                  {/* Assigned User */}
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    Assigned To:{" "}

                    <span className="font-medium text-gray-700 dark:text-gray-200">
                      {task.assignedTo?.name || "Unassigned"}
                    </span>
                  </p>

                  {/* Status + Priority */}
                  <div className="flex flex-wrap gap-2 mt-3">

                    {/* Status */}
                    <span
                      className={`
                        px-2.5 py-1
                        text-xs
                        font-semibold
                        rounded-full
                        capitalize
                        ${getStatusColor(task.status)}
                      `}
                    >
                      {task.status}
                    </span>

                    {/* Priority */}
                    <span
                      className={`
                        px-2.5 py-1
                        text-xs
                        font-semibold
                        rounded-full
                        capitalize
                        ${getPriorityColor(task.priority)}
                      `}
                    >
                      {task.priority}
                    </span>

                  </div>

                  {/* Due Date */}
                  <p className="text-sm mt-3 text-gray-500 dark:text-gray-400">

                    Due:{" "}

                    <span className="font-medium text-gray-700 dark:text-gray-200">

                      {task.due
                        ? new Date(task.due).toLocaleDateString()
                        : "No due date"}

                    </span>

                  </p>

                </div>

                {/* ❌ Delete Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}

                  onClick={() => handleDelete(task._id)}

                  className="
                    mt-5
                    w-full
                    py-2.5
                    rounded-xl

                    bg-red-50
                    dark:bg-red-900/30

                    text-red-700
                    dark:text-red-400

                    border
                    border-red-200
                    dark:border-red-800

                    hover:bg-red-100
                    dark:hover:bg-red-900/50

                    transition-colors
                  "
                >
                  Delete Task
                </motion.button>

              </motion.div>

            ))}

          </div>
        </AnimatePresence>

      )}

    </div>
  );
}