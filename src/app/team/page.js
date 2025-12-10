"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, User, Mail, Briefcase } from "lucide-react";

export default function Employees() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchEmployees() {
      try {
        const res = await fetch("/api/admin/employees");
        const data = await res.json();
        setUsers(data.employees || []);
      } catch (err) {
        console.error("Error fetching employees:", err);
      }
    }

    fetchEmployees();
  }, []);

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-blue-100 px-5 py-20 ">

      {/* Header */}
      <motion.h2
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold text-center mb-6 text-purple-700"
      >
        Employees List
      </motion.h2>

      {/* Search Bar */}
      <div className="max-w-xl mx-auto mb-8">
        <div className="flex items-center bg-white p-3 rounded-xl shadow">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search employee by name..."
            className="ml-3 w-full outline-none"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Employees Grid */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredUsers.map((user, index) => (
          <motion.div
            key={user._id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white p-5 rounded-xl shadow-lg hover:shadow-xl transition cursor-pointer"
          >
            {/* Avatar */}
            <div className="flex justify-center mb-3">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold">
                {user.name[0].toUpperCase()}
              </div>
            </div>

            <h3 className="text-lg font-semibold text-center">{user.name}</h3>

            <div className="mt-3 space-y-2 text-gray-600 text-sm">

              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-600" />
                <span>{user.email}</span>
              </div>

              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-green-600" />
                <span className="capitalize font-medium">
                  {user.techRole}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-purple-600" />
                <span className="capitalize">{user._id}</span>
              </div>

            </div>
          </motion.div>
        ))}
      </div>

      {/* No employees found */}
      {filteredUsers.length === 0 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-gray-500 mt-10"
        >
          No matching employees found 😕
        </motion.p>
      )}
    </div>
  );
}
