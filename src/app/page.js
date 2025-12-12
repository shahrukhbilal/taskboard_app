"use client";

import { motion } from "framer-motion";
import { ArrowRight, CheckCircle, LayoutDashboard, Users, Shield } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-200 via-purple-200 to-white text-gray-900">

      {/* ===================== NAVBAR ===================== */}
      <nav className="flex justify-between  items-center px-10 py-5">
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="text-2xl font-bold text-purple-700"
        >
          TaskMaster
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex gap-5"
        >
          <a href="/auth/login" className="hover:text-purple-700 transition">Login</a>
          <a
            href="/auth/register"
            className="bg-purple-600 text-white px-4 py-2 rounded-lg shadow hover:bg-purple-700 transition"
          >
            Register
          </a>
        </motion.div>
      </nav>

      {/* ===================== HERO SECTION ===================== */}
      <div className="flex flex-col items-center text-center mt-20 px-4">

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-4xl md:text-6xl font-bold leading-tight"
        >
          Manage Tasks <span className="text-purple-700">Smarter</span>
          <br /> Work Faster.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="max-w-xl text-gray-600 mt-4"
        >
          A modern task management system designed for teams and admins.  
          Intuitive, fast, and perfectly optimized for daily workflows.
        </motion.p>

        <motion.a
          href="/auth/login"
          whileHover={{ scale: 1.07 }}
          whileTap={{ scale: 0.97 }}
          className="mt-6 bg-purple-700 text-white px-6 py-3 rounded-xl text-lg shadow-lg flex items-center gap-2"
        >
          Get Started <ArrowRight size={20} />
        </motion.a>
      </div>

      {/* ===================== FEATURES SECTION ===================== */}
      <section className="mt-28 px-10 pb-20">

        <motion.h3
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-3xl font-bold text-center mb-10"
        >
          Powerful Features
        </motion.h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">

          {/* CARD 1 */}
          <motion.div
            whileHover={{ scale: 1.05, rotate: 1 }}
            transition={{ type: "spring", stiffness: 150 }}
            className="bg-white rounded-xl p-6 shadow-lg text-center border"
          >
            <LayoutDashboard className="mx-auto mb-3 text-purple-700" size={40} />
            <h4 className="font-bold text-xl mb-2">Admin Dashboard</h4>
            <p className="text-gray-600">
              Complete control over users, tasks, and workflow tracking.
            </p>
          </motion.div>

          {/* CARD 2 */}
          <motion.div
            whileHover={{ scale: 1.05, rotate: -1 }}
            transition={{ type: "spring", stiffness: 150 }}
            className="bg-white rounded-xl p-6 shadow-lg text-center border"
          >
            <Users className="mx-auto mb-3 text-purple-700" size={40} />
            <h4 className="font-bold text-xl mb-2">User Workspace</h4>
            <p className="text-gray-600">
              A clean interface for employees to manage and complete tasks.
            </p>
          </motion.div>

          {/* CARD 3 */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 150 }}
            className="bg-white rounded-xl p-6 shadow-lg text-center border"
          >
            <Shield className="mx-auto mb-3 text-purple-700" size={40} />
            <h4 className="font-bold text-xl mb-2">Secure Authentication</h4>
            <p className="text-gray-600">
              Role-based access, JWT authentication, and protected routes.
            </p>
          </motion.div>

        </div>

      </section>
    </div>
  );
}
