// app/api/tasks/[id]/route.js

import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect"; // MongoDB connection helper
import Task from "@/model/Task"; // Task model

// 🗑️ API to delete a task by its ID
export async function DELETE(request, { params }) {
  try {
    // 🗄️ Connect to MongoDB
    await dbConnect();

    // 1️⃣ Extract task ID from route params
    const { id } = await params;

    // 2️⃣ Attempt to find and delete the task
    const deletedTask = await Task.findByIdAndDelete(id);

    // ❌ Task not found → 404
    if (!deletedTask) {
      return NextResponse.json(
        { message: "Task not found" },
        { status: 404 }
      );
    }

    // ✅ Success response
    return NextResponse.json(
      { message: "Task deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    // 🔥 Catch-all for errors
    console.error("Delete task error:", error);

    return NextResponse.json(
      { message: "Failed to delete task" },
      { status: 500 }
    );
  }
}
