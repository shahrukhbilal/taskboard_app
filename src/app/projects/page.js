'use client'

import { Plus, CalendarDays } from "lucide-react";
import { useEffect, useState } from "react";

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasksAndBuildProjects = async () => {
      try {
        const res = await fetch(`/api/tasks`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const tasks = await res.json();

        // 🧠 CURRENT DB REALITY:
        // Task document has NO project info
        // So we treat ALL tasks as ONE default project

        const totalTasks = tasks.length;
        const completedTasks = tasks.tasks.filter(
          (t) => t.status === "done"
        ).length;

        const progress = totalTasks
          ? Math.round((completedTasks / totalTasks) * 100)
          : 0;

        const project = {
          _id: "default-project",
          title: "My Tasks",
          description: "All assigned tasks",
          status: "active",
          endDate:
            tasks.length > 0
              ? tasks
                  .map((t) => new Date(t.due))
                  .sort((a, b) => b - a)[0]
              : null,
          totalTasks,
          completedTasks,
          progress,
        };

        setProjects([project]);
      } catch (error) {
        console.error("Failed to fetch tasks", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasksAndBuildProjects();
  }, []);

  if (loading) {
    return <div className="p-6">Loading projects...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Projects</h1>
          <p className="text-sm text-gray-500">
            Projects generated from existing tasks
          </p>
        </div>
        <button className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-xl">
          <Plus size={18} /> New Project
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div
            key={project._id}
            className="bg-white rounded-2xl p-5 shadow-sm border"
          >
            <h2 className="font-semibold">{project.title}</h2>
            <p className="text-sm text-gray-500 mt-2">
              {project.description}
            </p>

            <div className="mt-4">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Progress</span>
                <span>{project.progress}%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full">
                <div
                  className="h-2 bg-black rounded-full"
                  style={{ width: `${project.progress}%` }}
                ></div>
              </div>
            </div>

            <div className="flex items-center gap-1 mt-4 text-xs text-gray-500">
              <CalendarDays size={14} />
              {project.endDate
                ? new Date(project.endDate).toDateString()
                : "No due date"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
