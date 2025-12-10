import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import User from "@/model/User";

export async function POST(req) {
  try {
    await dbConnect();

    const { name, email, password, role, techRole, adminSecret } = await req.json();
    

    // --- ROLE VALIDATION ---
    if (role === "admin") {
      if (!adminSecret) {
        return NextResponse.json(
          { error: "Admin secret key is required" },
          { status: 400 }
        );
      }

      if (adminSecret !== process.env.ADMIN_SECRET_KEY) {
        return NextResponse.json(
          { error: "Invalid Admin Secret Key" },
          { status: 403 }
        );
      }
    }

    // --- CHECK USER ALREADY EXISTS ---
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // --- HASH PASSWORD ---
    const hashedPassword = await bcrypt.hash(password, 10);

    // --- CREATE USER ---
    const newUser = await User.create({
      name,
      email,
      role,
      techRole,
      password: hashedPassword,
    });
    console.log('new user is :' , newUser)

    return NextResponse.json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        techRole:newUser.techRole
      },
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
