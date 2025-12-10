"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function EmployeeDashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // ⭐ Fetch tasks from backend
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

  // ⭐ STATUS UPDATE FUNCTION
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
      fetchTasks(); // Refresh UI

    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="p-8">

      <h1 className="text-3xl font-bold mb-6">My Tasks</h1>

      {/* 🟦 LOADING STATE */}
      {loading && (
        <p className="text-gray-500">Loading your tasks...</p>
      )}

      {/* 🟩 NO TASKS */}
      {!loading && tasks.length === 0 && (
        <p className="text-gray-600">
          You currently have no assigned tasks.
        </p>
      )}

      {/* 🟧 SHOW TASKS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {tasks.map((task) => (
          <div
            key={task._id}
            className="p-4 bg-white rounded-xl shadow hover:shadow-lg transition"
          >
            <h2 className="text-xl font-semibold">
              <span className="font-semibold">Task:</span> {task.title}
            </h2>

            <p className="text-gray-600 mt-1">
              <span className="font-semibold">Description:</span> {task.description}
            </p>

            <p className="text-sm mt-2">
              <span className="font-semibold">Status:</span> {task.status}
            </p>

            <p className="text-sm">
              <span className="font-semibold">Due:</span>{" "}
              {new Date(task.due).toLocaleDateString()}
            </p>

            {/* ⭐ STATUS UPDATE DROPDOWN */}
            <select
              value={task.status}
              onChange={(e) => updateStatus(task._id, e.target.value)}
              className="mt-3 p-2 border rounded-lg"
            >
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}
