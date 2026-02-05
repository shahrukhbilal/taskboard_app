import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

// 🔒 Route to verify the JWT stored in cookies and return user info
export async function GET(req) {
  try {
    // 1️⃣ Retrieve the token from cookies (key: "task_token")
    const token = req.cookies.get("task_token")?.value;

    // 2️⃣ If token is missing → respond with 401 Unauthorized
    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized: No token found" },
        { status: 401 }
      );
    }

    // 3️⃣ Verify the JWT using our secret
    //    This will throw an error if token is invalid/expired
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4️⃣ Token is valid → return basic user info
    return NextResponse.json({
      message: "Token valid",
      user: {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role,
      },
    });
  } catch (err) {
    // 🔥 JWT verification failed (invalid or expired token)
    console.log("JWT verification error:", err);

    return NextResponse.json(
      { error: "Unauthorized: Invalid token" },
      { status: 401 }
    );
  }
}
