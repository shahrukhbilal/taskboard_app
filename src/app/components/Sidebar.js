"use client";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  FolderKanban,
  ClipboardList,
  Calendar,
  Users,
  Settings,
  LogOut,
} from "lucide-react";
import Link from "next/link";

export default function Sidebar({ isOpen, toggleSidebar }) {
  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/" },
    { name: "Tasks", icon: ClipboardList, path: "/tasks" },
    { name: "Projects", icon: FolderKanban, path: "/projects" },
    { name: "Calendar", icon: Calendar, path: "/Calendar" },
    { name: "Team", icon: Users, path: "/team" },
    { name: "Settings", icon: Settings, path: "/settings" },
  ];

  return (
    <div className="flex">
      {/* Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial={{ x: "-100%", opacity: 0 }}
            animate={{ x: "0%", opacity: 1 }}
            exit={{ x: "-100%", opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed top-16 left-0 h-screen w-60 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 shadow-md z-40 overflow-y-auto"
          >
            <nav className="flex flex-col h-full py-3">
              <ul className="flex-1 mt-10 space-y-1">
                {menuItems.map(({ name, icon: Icon, path }) => (
                  <li key={name}>
                    <Link
                      href={path}
                      className="flex items-center gap-3 px-6 py-3 text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-800 transition"
                      onClick={() => {
                        // Auto-close on mobile after click
                        if (window.innerWidth < 1024) toggleSidebar();
                      }}
                    >
                      <Icon className="w-5 h-5 text-blue-600" />
                      <span>{name}</span>
                    </Link>
                  </li>
                ))}
              </ul>

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
