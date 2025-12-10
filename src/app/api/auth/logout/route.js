import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json(
    { message: "Logged out successfully" },
    { status: 200 }
  );

  // Delete cookie
  res.cookies.set("task_token", "", {
    expires: new Date(0), // instantly expire
    path: "/",
  });

  return res;
}
