import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Task from "@/model/Task";
import jwt from "jsonwebtoken";

export async function GET(req) {
  try {
    await dbConnect();

    // 1   Extract token from cookies
    const token = req.cookies.get("task_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2  Decode token → Get userId
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
console.log("Decoded Token:", decoded);


    const userId = decoded.id;
    console.log("UserId is :", userId)
    // 3 Find tasks assigned to this employee
    const tasks = await Task.find({ assignedTo: userId });



    // 4 Return only extracted id's tasks
    return NextResponse.json(tasks, { status: 200 });

  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
