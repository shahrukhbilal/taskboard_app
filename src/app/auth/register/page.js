"use client";

import { useState } from "react";
import { toast } from "sonner"; // For showing notifications
import { useRouter } from "next/navigation"; // For client-side navigation

export default function RegisterPage() {
  const router = useRouter();

  // 🧠 Form state for all inputs
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    techRole: "",
    role: "employee", // default role
    adminSecret: "", // only required if role is admin
  });

  // 🔑 Show/hide admin secret input based on selected role
  const [showSecret, setShowSecret] = useState(false);

  // ✏️ Handle changes for all form inputs
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    // If user selects admin role, show admin secret field
    if (e.target.name === "role") {
      setShowSecret(e.target.value === "admin");
    }
  };

  // 🚀 Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // 1️⃣ Send registration request to backend
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // include cookies if any
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      console.log("Registered user:", data);

      // ❌ Show error if registration fails
      if (!res.ok) {
        toast.error(data.error || "Something went wrong");
        return;
      }

      // ✅ Show success toast
      toast.success("User Registered Successfully 😎");

      // 2️⃣ Extract user role from response
      const role = data?.user?.role?.trim()?.toLowerCase();

      // ⭐ Safe redirect based on role
      setTimeout(() => {
        if (role === "admin") {
          router.push("/dashboard/admindashboard");
        } else if (role === "employee") {
          router.push("/dashboard/employeedashboard");
        } else {
          toast.error("No role assigned to this user");
        }
      }, 100); // short delay to allow toast to show

    } catch (error) {
      // ❌ Handle network or unexpected errors
      toast.error("Request failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      {/* 📝 Registration form container */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-md w-full max-w-sm space-y-4"
      >
        <h2 className="text-center text-xl font-bold">Register</h2>

        {/* 👤 Name input */}
        <input
          type="text"
          name="name"
          placeholder="Name"
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />

        {/* 📧 Email input */}
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />

        {/* 🔒 Password input */}
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />

        {/* 🏷️ Role selection */}
        <select
          name="role"
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="employee">Employee</option>
          <option value="admin">Admin</option>
        </select>

        {/* 🖥️ Tech role selection */}
        <select
          name="techRole"
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="">Select Tech Role</option>
          <option value="frontend">frontend</option>
          <option value="backend">backend</option>
          <option value="fullstack">fullstack</option>
          <option value="database">database</option>
        </select>

        {/* 🔑 Admin secret input, only shown if role is admin */}
        {showSecret && (
          <input
            type="text"
            name="adminSecret"
            placeholder="Enter Admin Secret Key"
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required={showSecret}
          />
        )}

        {/* ✅ Submit button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Register
        </button>
      </form>
    </div>
  );
}
