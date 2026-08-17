// app/api/auth/check/route.js
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(req) {
  try {
    // 1️⃣ Extract token from cookies
    const token = req.cookies.get("task_token")?.value;
    console.log("Auth Check Token:", token);

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2️⃣ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded Token:", decoded);

    // 3️⃣ Only allow admin for admin dashboard
    if (decoded.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({
      message: "Authorized",
      user: decoded,
    });
  } catch (err) {
    console.error("Auth Check Error:", err);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
