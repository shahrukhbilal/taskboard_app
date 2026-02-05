import { NextResponse } from "next/server";
import bcrypt from "bcryptjs"; // For hashing passwords securely
import dbConnect from "@/lib/dbConnect"; // Helper to connect to MongoDB
import User from "@/model/User"; // Mongoose User model

// 📝 User Registration API
export async function POST(req) {
  try {
    // 🗄️ Connect to the database
    await dbConnect();

    // 📩 Parse incoming request body
    const { name, email, password, role, techRole, adminSecret } = await req.json();

    // --- ROLE VALIDATION ---
    // 🔑 If user wants to register as admin, validate adminSecret
    if (role === "admin") {
      // ❌ Missing admin secret
      if (!adminSecret) {
        return NextResponse.json(
          { error: "Admin secret key is required" },
          { status: 400 }
        );
      }

      // ❌ Wrong admin secret
      if (adminSecret !== process.env.ADMIN_SECRET_KEY) {
        return NextResponse.json(
          { error: "Invalid Admin Secret Key" },
          { status: 403 } // Forbidden
        );
      }
    }

    // --- CHECK IF USER ALREADY EXISTS ---
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      // ❌ Prevent duplicate registration
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // --- HASH PASSWORD ---
    // 🔒 Use bcrypt to hash the password before storing it in DB
    const hashedPassword = await bcrypt.hash(password, 10);

    // --- CREATE NEW USER ---
    const newUser = await User.create({
      name,
      email,
      role,
      techRole,
      password: hashedPassword, // store hashed password, never plaintext
    });

    // ✅ Return success response with user info (excluding password)
    return NextResponse.json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        techRole: newUser.techRole,
      },
    });
  } catch (error) {
    console.log(error);

    // ❌ Catch-all for server errors
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
