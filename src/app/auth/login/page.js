"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // For client-side navigation
import { toast } from "sonner"; // Toast notifications

export default function LoginPage() {
  const router = useRouter();

  // 🧠 Form state for email & password
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // ✏️ Handle input changes dynamically
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // 🚀 Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // 1️⃣ Send login request to backend
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // include cookies
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      console.log("Login Response:", data);

      // ❌ Show error if login fails
      if (!res.ok) {
        toast.error(data.error || "Invalid credentials");
        return;
      }

      // ✅ Success toast
      toast.success("Login Successful 😎 redirecting...");

      // Extract user role from response
      const role = data?.user?.role?.trim()?.toLowerCase();

      // ⭐ Redirect based on role
      setTimeout(() => {
        if (role === "admin") {
          router.push("/dashboard/admindashboard");
        } else if (role === "employee") {
          router.push("/dashboard/employeedashboard");
        } else {
          toast.error("No role assigned to this user");
        }
      }, 100); // small delay to allow toast to show
    } catch (error) {
      // ❌ Catch network or unexpected errors
      toast.error("Request failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      {/* 📝 Login form container */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-md w-full max-w-sm space-y-4"
      >
        <h2 className="text-center text-xl font-bold">Login</h2>

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

        {/* ✅ Submit button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Login
        </button>
      </form>
    </div>
  );
}
