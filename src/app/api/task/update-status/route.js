import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Task from "@/model/Task";

export async function PUT(req) {
  try {
    await dbConnect();

    const { taskId, status } = await req.json();

    const updated = await Task.findByIdAndUpdate(
      taskId,
      { status },
      { new: true }
    );

    return NextResponse.json({ success: true, updated });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
