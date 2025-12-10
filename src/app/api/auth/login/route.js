import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/dbConnect";
import User from "@/model/User";

export async function POST(req) {
  try {
    await dbConnect();

    const { email, password } = await req.json();

    // 1️⃣ Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 400 }
      );
    }

    // 2️⃣ Compare password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 400 }
      );
    }

    // 3️⃣ Create JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 4️⃣ Create response & set HTTP-only cookie
    const response = NextResponse.json({
      message: "Login successful",
      
      user: {
        id: user._id,
        role: user.role,
        name: user.name,
        email: user.email,
      },
    });

     response.cookies.set({
      name: "task_token",       // cookie name
      value: token,             // JWT token
      httpOnly: true,           // JS cannot access
      path: "/",                // all routes
      maxAge: 7 * 24 * 60 * 60, // 7 days
      sameSite: "strict",       // CSRF protection
      secure: process.env.NODE_ENV === "production", // HTTPS only in prod
    });

    return response;
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
