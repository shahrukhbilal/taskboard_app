import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/dbConnect";
import User from "@/model/User";

// 📝 User Registration API
export async function POST(req) {
  try {
    // Connect to DB
    await dbConnect();

    const { name, email, password, role, techRole, adminSecret } = await req.json();

    // --- ROLE VALIDATION ---
    if (role === "admin") {
      if (!adminSecret) {
        return NextResponse.json({ error: "Admin secret key is required" }, { status: 400 });
      }
      if (adminSecret !== process.env.ADMIN_SECRET_KEY) {
        return NextResponse.json({ error: "Invalid Admin Secret Key" }, { status: 403 });
      }
    }

    // --- CHECK IF USER EXISTS ---
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    // --- HASH PASSWORD ---
    const hashedPassword = await bcrypt.hash(password, 10);

    // --- CREATE NEW USER ---
    const newUser = await User.create({
      name,
      email,
      role,
      techRole,
      password: hashedPassword,
    });

    // --- GENERATE JWT TOKEN ---
    const token = jwt.sign(
      { id: newUser._id, email: newUser.email, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // --- CREATE RESPONSE & SET COOKIE ---
    const response = NextResponse.json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        techRole: newUser.techRole,
      },
    });

    // ✅ Set HTTP-only cookie
    response.cookies.set({
      name: "task_token",
      value: token,
      httpOnly: true,
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      sameSite: "lax",          // localhost friendly
      secure: process.env.NODE_ENV === "production" ? true : false
    });

    return response;

  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
