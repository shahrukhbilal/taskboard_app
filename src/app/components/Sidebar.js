"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutDashboard, FolderKanban, ClipboardList, Calendar, Users, Settings, LogOut, Menu } from "lucide-react";
import Link from "next/link";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);

  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/" },
    { name: "Tasks", icon: ClipboardList, path: "tasks" },
    { name: "Projects", icon: FolderKanban, path: "projects" },
    { name: "Calendar", icon: Calendar, path: "/Calendar" },
    { name: "Team", icon: Users, path: "/team" },
    { name: "Settings", icon: Settings, path: "/settings" },
  ];

  return (
    <div className="flex">      {/* Toggle Button */}
      <button
  onClick={() => setIsOpen(!isOpen)}
  className="fixed top-18 left-5.5 z-50 bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-700 transition"
>
  <Menu className="w-5 h-5" />
</button>


      {/* Sidebar Container */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 200, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed top-16 left-0 h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 shadow-md z-40 overflow-hidden"
          >
            <nav className="flex py-3  flex-col h-full">
              {/* Menu Items */}
              <ul className="flex-1 mt-10  space-y-1">
                {menuItems.map(({ name, icon: Icon, path }) => (
                  <li key={name}>
                    <Link
                      href={path}
                      className="flex items-center gap-3 px-6 py-3 text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-800 transition"
                    >
                      <Icon className="w-5 h-5 text-blue-600" />
                      <span>{name}</span>
                    </Link>
                  </li>
                ))}
              </ul>

              {/* Logout Section */}
              <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                <button className="flex items-center gap-3 text-red-500 hover:text-red-600 transition">
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </div>
            </nav>
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  );
}
