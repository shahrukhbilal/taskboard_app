import { NextResponse } from "next/server";

export function middleware(req) {
  const token = req.cookies.get("task_token")?.value;

  if (
    req.nextUrl.pathname.startsWith("/auth/login") ||
    req.nextUrl.pathname.startsWith("/api")
  ) return NextResponse.next();

  if (!token) return NextResponse.redirect(new URL("/auth/login", req.url));

  return NextResponse.next();
}

export const config = { matcher: ["/dashboard/:path*"] };
