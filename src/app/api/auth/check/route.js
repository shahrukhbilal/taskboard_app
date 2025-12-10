import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(req) {
  try {
    // 1️⃣ Get token from cookie
    const token = req.cookies.get("task_token")?.value;

    // 2️⃣ Token missing → Unauthorized
    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized: No token found" },
        { status: 401 }
      );
    }

    // 3️⃣ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4️⃣ Return user info
    return NextResponse.json({
      message: "Token valid",
      user: {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role,
      },
    });
  } catch (err) {
    console.log("JWT verification error:", err);

    // Invalid token
    return NextResponse.json(
      { error: "Unauthorized: Invalid token" },
      { status: 401 }
    );
  }
}
