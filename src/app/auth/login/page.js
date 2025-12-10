"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
       credentials: "include",
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      console.log("Login Response:", data);

      if (!res.ok) {
        toast.error(data.error || "Invalid credentials");
        return;
      }

      // ✅ Success toast
      toast.success("Login Successful 😎 redirecting...");

      // ✅ Save token in localStorage
      
      // Extract user role
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
      }, 100);

    } catch (error) {
      toast.error("Request failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-md w-full max-w-sm space-y-4"
      >
        <h2 className="text-center text-xl font-bold">Login</h2>

        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />

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
