import { NextResponse } from "next/server";

// 🔓 Logout API: Clears the JWT cookie to log the user out
export async function POST() {
  // 1️⃣ Prepare success response
  const res = NextResponse.json(
    { message: "Logged out successfully" },
    { status: 200 }
  );

  // 2️⃣ Delete the cookie by setting it to empty and expiring it immediately
  res.cookies.set("task_token", "", {
    expires: new Date(0), // cookie expires instantly
    path: "/",             // ensure cookie is cleared on all routes
  });

  // 3️⃣ Return the response
  return res;
}
