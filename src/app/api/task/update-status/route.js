import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect"; // MongoDB connection helper
import Task from "@/model/Task"; // Task model

// 📝 API to update a task's status
export async function PUT(req) {
  try {
    // 🗄️ Connect to MongoDB
    await dbConnect();

    // 📩 Parse request body
    const { taskId, status } = await req.json();

    // 1️⃣ Find the task by ID
    const task = await Task.findById(taskId);
    if (!task) {
      // ❌ Task not found → 404
      return NextResponse.json(
        { success: false, message: "Task not found" },
        { status: 404 }
      );
    }

    // 🔥 Core logic: updating task status
    // If marking as completed and it wasn't already completed
    if (status === "completed" && task.status !== "completed") {
      task.status = "completed";
      task.completedAt = new Date(); // auto-set completion date
    } else {
      // Otherwise, just update status (pending/upcoming)
      task.status = status;
    }

    // 💾 Save the updated task
    await task.save();

    // ✅ Return updated task data
    return NextResponse.json({ success: true, updated: task });
  } catch (error) {
    // ❌ Catch-all for errors
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
