"use client";
import { useEffect, useState } from "react";
import { ClipboardList, CheckCircle, Clock, CalendarDays } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function AdminDashBoard() {
  const router = useRouter();
  const [dataLoaded, setDataLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    inProgress: 0,
    upcomingDeadlines: 0,
  });
  const [weekly, setWeekly] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch("/api/auth/check", {
        method: "GET",
        credentials: "include",
      });

      if (!res.ok) {
        toast.error("Please login first!");
        router.push("/auth/login");
      }
    };

    fetchUser();
  }, [router]);

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      try {
        const res = await fetch("/api/tasks");
        if (!res.ok) throw new Error("Failed to fetch");

        const json = await res.json();
        if (!mounted) return;

        setTasks(json.tasks || []);
        setStats(json.stats || {});
        setWeekly(json.weekly || []);
        setDataLoaded(true);
      } catch (err) {
        if (!mounted) return;
        setError(err.message || "Error");
        setDataLoaded(true);
      }
    };

    fetchData();
    return () => (mounted = false);
  }, []);

  const completionPct =
    stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  const cards = [
    {
      title: "Total Tasks",
      value: stats.total,
      icon: ClipboardList,
      color: "text-blue-600",
      bg: "bg-blue-50 dark:bg-blue-900/30",
    },
    {
      title: "Completed Tasks",
      value: stats.completed,
      icon: CheckCircle,
      color: "text-green-600",
      bg: "bg-green-50 dark:bg-green-900/30",
    },
    {
      title: "Pending Tasks",
      value: stats.pending,
      icon: Clock,
      color: "text-yellow-600",
      bg: "bg-yellow-50 dark:bg-yellow-900/30",
    },
    {
      title: "Upcoming Deadlines",
      value: stats.upcomingDeadlines,
      icon: CalendarDays,
      color: "text-red-600",
      bg: "bg-red-50 dark:bg-red-900/30",
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-6 mt-2 sm:mt-4 px-2 sm:px-0">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800 dark:text-gray-100">
          Dashboard
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base">
          Overview of your recent activity and task progress.
        </p>
      </div>

      {!dataLoaded ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="animate-pulse p-4 sm:p-5 rounded-2xl bg-gray-100 dark:bg-gray-800 h-24 sm:h-28"
            />
          ))}
        </div>
      ) : error ? (
        <div className="p-4 rounded-2xl bg-red-50 text-red-700 text-sm sm:text-base">
          Error loading dashboard: {error}
        </div>
      ) : (
        <>
          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {cards.map(({ title, value, icon: Icon, color, bg }, index) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08, duration: 0.4 }}
                whileHover={{
                  scale: 1.03,
                  boxShadow: "0 10px 20px rgba(0,0,0,0.10)",
                }}
                className={`flex items-center gap-3 sm:gap-4 p-4 sm:p-5 rounded-2xl border border-gray-200 dark:border-gray-800 ${bg}`}
              >
                <div
                  className={`p-2 sm:p-3 rounded-xl ${color} bg-white dark:bg-gray-900 shadow-sm`}
                >
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div>
                  <h2 className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm">
                    {title}
                  </h2>
                  <p className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">
                    {value ?? 0}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Progress + Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Progress Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="col-span-1 bg-white dark:bg-gray-900 p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800"
            >
              <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 text-gray-800 dark:text-gray-100">
                Completion Progress
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-2 sm:mb-3">
                {stats.completed} completed out of {stats.total} tasks
              </p>

              <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2 sm:h-3 overflow-hidden">
                <div
                  className="h-2 sm:h-3 rounded-full bg-blue-600 transition-all"
                  style={{ width: `${completionPct}%` }}
                />
              </div>

              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-2 sm:mt-3">
                {completionPct}% completed
              </p>

              {/* Upcoming tasks */}
              <div className="mt-4 space-y-2">
                <h4 className="text-base sm:text-lg font-semibold text-red-700 dark:text-gray-200">
                  Upcoming Deadlines
                </h4>

                {tasks.length === 0 ? (
                  <p className="text-xs sm:text-sm text-gray-500">No tasks.</p>
                ) : (
                  tasks
                    .filter((t) => {
                      const due = new Date(t.due);
                      const now = new Date();
                      const diffDays = Math.ceil(
                        (due - now) / (1000 * 60 * 60 * 24)
                      );
                      return diffDays >= 0 && diffDays <= 7;
                    })
                    .slice(0, 3)
                    .map((t) => (
                      <div key={t._id} className="flex justify-between">
                        <div>
                          <p className="text-sm text-gray-700 dark:text-gray-200">
                            {t.title}
                          </p>
                          <p className="text-xs text-red-700">Due: {t.due}</p>
                        </div>
                      </div>
                    ))
                )}
              </div>
            </motion.div>

            {/* Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="col-span-1 lg:col-span-2 bg-white dark:bg-gray-900 p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800"
            >
              <h2 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 text-gray-800 dark:text-gray-100">
                Weekly Task Progress
              </h2>

              <div className="h-56 sm:h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={weekly}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                    <XAxis dataKey="name" stroke="#888" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="tasks"
                      stroke="#3b82f6"
                      strokeWidth={3}
                      dot={{ r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>

          {/* Recent Tasks Table */}
          <div className="bg-white dark:bg-gray-900 p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800">
            <h3 className="text-base sm:text-lg font-semibold mb-3 text-gray-800 dark:text-gray-100">
              Recent Tasks
            </h3>

            {tasks.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                No tasks yet.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-left">
                  <thead>
                    <tr>
                      <th className="px-2 py-2 sm:px-4 sm:py-2 text-xs sm:text-sm text-gray-500">
                        Title
                      </th>
                      <th className="px-2 py-2 sm:px-4 sm:py-2 text-xs sm:text-sm text-gray-500">
                        Status
                      </th>
                      <th className="px-2 py-2 sm:px-4 sm:py-2 text-xs sm:text-sm text-gray-500">
                        Due
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {tasks.slice(0, 8).map((t) => (
                      <tr
                        key={t._id}
                        className="border-t border-gray-100 dark:border-gray-800"
                      >
                        <td className="px-2 py-2 sm:px-4 sm:py-3 text-sm">
                          {t.title}
                        </td>
                        <td className="px-2 py-2 sm:px-4 sm:py-3 text-sm">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              t.status === "done"
                                ? "bg-green-100 text-green-700"
                                : t.status === "in-progress"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {t.status}
                          </span>
                        </td>
                        <td className="px-2 py-2 sm:px-4 sm:py-3 text-sm">
                          {t.due}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
