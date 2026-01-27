// app/api/tasks/[id]/route.js

import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Task from "@/model/Task";


export async function DELETE(request, { params }) {
  try {
    await dbConnect();

    const { id } = await params;

    const deletedTask = await Task.findByIdAndDelete(id);

    if (!deletedTask) {
      return NextResponse.json(
        { message: "Task not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Task deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete task error:", error);

    return NextResponse.json(
      { message: "Failed to delete task" },
      { status: 500 }
    );
  }
}
