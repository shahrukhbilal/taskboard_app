import { NextResponse } from "next/server";
import bcrypt from "bcryptjs"; // For hashing and comparing passwords securely
import jwt from "jsonwebtoken"; // For generating JWT tokens
import dbConnect from "@/lib/dbConnect"; // MongoDB connection helper
import User from "@/model/User"; // Mongoose User model

// 🔑 Login API: Authenticates user and returns JWT in HTTP-only cookie
export async function POST(req) {
  try {
    // 🗄️ Connect to MongoDB
    await dbConnect();

    // 📩 Parse request body
    const { email, password } = await req.json();

    // 1️⃣ Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      // ❌ User not found → return generic error to avoid info leak
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 400 }
      );
    }

    // 2️⃣ Compare password with hashed password in DB
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      // ❌ Incorrect password → same generic error
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 400 }
      );
    }

    // 3️⃣ Create JWT token containing user ID, email, and role
    //    Token expires in 7 days
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 4️⃣ Prepare response & set HTTP-only cookie with the token
    const response = NextResponse.json({
      message: "Login successful",
      user: {
        id: user._id,
        role: user.role,
        name: user.name,
        email: user.email,
      },
    });

    // 🍪 Set cookie options for security
    response.cookies.set({
      name: "task_token",                    // cookie name
      value: token,                          // JWT token
      httpOnly: true,                        // JS cannot access (prevents XSS)
      path: "/",                             // cookie available on all routes
      maxAge: 7 * 24 * 60 * 60,             // 7 days in seconds
      sameSite: "strict",                    // CSRF protection
      secure: process.env.NODE_ENV === "production" ? true : false

    });

    return response;
  } catch (error) {
    console.log(error);

    // ❌ Internal server error catch-all
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
