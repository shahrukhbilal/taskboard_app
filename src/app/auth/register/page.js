
"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router= useRouter()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    techRole: '',
    role: "employee",
    adminSecret: "",
  });

  const [showSecret, setShowSecret] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    if (e.target.name === "role") {
      setShowSecret(e.target.value === "admin");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/auth/register", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  credentials: "include", 
  body: JSON.stringify(formData),
});


      const data = await res.json();
    console.log('registerd user is :', data)

      if (!res.ok) {
        toast.error(data.error || "Something went wrong");
      } else {
        toast.success("User Registered Successfully 😎");
      }

      
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
        <h2 className="text-center text-xl font-bold">Register</h2>

        <input
          type="text"
          name="name"
          placeholder="Name"
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />

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

        <select
          name="role"
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="employee">Employee</option>
          <option value="admin">Admin</option>
        </select>
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
