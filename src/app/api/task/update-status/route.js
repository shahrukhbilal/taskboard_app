import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Task from "@/model/Task";

export async function PUT(req) {
  try {
    await dbConnect();

    const { taskId, status } = await req.json();

    const task = await Task.findById(taskId);
    if (!task) {
      return NextResponse.json(
        { success: false, message: "Task not found" },
        { status: 404 }
      );
    }

    // 🔥 IMPORTANT LOGIC
    if (status === "completed" && task.status !== "completed") {
      task.status = "completed";
      task.completedAt = new Date(); // auto date set
    } else {
      task.status = status;
    }

    await task.save();

    return NextResponse.json({ success: true, updated: task });

  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

