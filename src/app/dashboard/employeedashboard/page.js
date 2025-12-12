"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { CheckCircle, Clock, AlertCircle } from "lucide-react";

export default function EmployeeDashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      const res = await fetch("/api/task/my-tasks");

      if (!res.ok) {
        toast.error("Failed to load tasks");
        return;
      }

      const data = await res.json();
      setTasks(data);

    } catch (err) {
      console.log(err);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const updateStatus = async (taskId, newStatus) => {
    try {
      const res = await fetch("/api/task/update-status", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskId, status: newStatus }),
      });

      if (!res.ok) {
        toast.error("Failed to update status");
        return;
      }

      toast.success("Status updated!");
      fetchTasks();

    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  const statusBadge = (status) => {
    if (status === "completed")
      return "bg-green-100 text-green-600 border border-green-200";

    if (status === "in-progress")
      return "bg-yellow-100 text-yellow-700 border border-yellow-300";

    return "bg-gray-100 text-gray-600 border border-gray-300";
  };

  const statusIcon = (status) => {
    if (status === "completed") return <CheckCircle className="w-5 h-5 text-green-600" />;
    if (status === "in-progress") return <Clock className="w-5 h-5 text-yellow-600" />;
    return <AlertCircle className="w-5 h-5 text-gray-500" />;
  };

  return (
    <div className="p-10 min-h-screen bg-linear-to-br from-indigo-200 via-purple-200 to-pink-200">

      {/* Page Title */}
      <motion.h1
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-5xl font-black mb-8 text-purple-700 tracking-tight"
      >
        My Tasks
      </motion.h1>

      {/* Loading Skeleton */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse p-6 bg-white/40 backdrop-blur-xl rounded-2xl shadow-xl">
              <div className="h-5 bg-gray-300 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      )}

      {/* No Tasks */}
      {!loading && tasks.length === 0 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-gray-700 text-xl"
        >
          You currently have no assigned tasks.
        </motion.p>
      )}

      {/* Task Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks.map((task, index) => (
          <motion.div
            key={task._id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.04 }}
            className="p-6 rounded-2xl shadow-2xl backdrop-blur-xl bg-white/40 border border-white/60 hover:shadow-[0_8px_30px_rgb(0,0,0,0.15)] transition"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-2xl font-bold text-gray-900">{task.title}</h2>
              {statusIcon(task.status)}
            </div>

            {/* Description */}
            <p className="text-gray-700 mb-3">{task.description}</p>

            {/* Due Date */}
            <p className="text-sm text-gray-500 mb-4">
              Due: {new Date(task.due).toLocaleDateString()}
            </p>

            {/* Status Badge */}
            <span className={`px-3 py-1 text-sm rounded-full font-semibold ${statusBadge(task.status)}`}>
              {task.status}
            </span>

            {/* Dropdown */}
            <select
              value={task.status}
              onChange={(e) => updateStatus(task._id, e.target.value)}
              className="mt-5 w-full p-3 border rounded-xl bg-white/50 hover:bg-white cursor-pointer shadow-sm"
            >
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>

            {/* Progress Bar */}
            <div className="w-full bg-gray-300 rounded-full h-2 mt-5">
              <div
                className={`h-2 rounded-full 
                  ${task.status === "completed"
                    ? "bg-green-500"
                    : task.status === "in-progress"
                    ? "bg-yellow-500"
                    : "bg-gray-500"
                  }`}
                style={{
                  width:
                    task.status === "completed"
                      ? "100%"
                      : task.status === "in-progress"
                      ? "60%"
                      : "20%",
                }}
              ></div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
