import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect"; // MongoDB connection helper
import Task from "@/model/Task"; // Task model
import jwt from "jsonwebtoken"; // JWT verification

// 📝 API to fetch tasks assigned to the logged-in user
export async function GET(req) {
  try {
    // 🗄️ Connect to MongoDB
    await dbConnect();

    // 1️⃣ Extract JWT token from cookies
    const token = req.cookies.get("task_token")?.value;

    // ❌ If token is missing → Unauthorized
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2️⃣ Decode & verify token to get user info
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded Token:", decoded);

    const userId = decoded.id;

    // 3️⃣ Fetch tasks assigned to this specific user only
    const tasks = await Task.find({ assignedTo: userId });

    // 4️⃣ Return user's tasks
    return NextResponse.json(tasks, { status: 200 });
  } catch (error) {
    console.log(error);

    // ❌ Catch-all for errors (invalid token, DB error, etc.)
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
