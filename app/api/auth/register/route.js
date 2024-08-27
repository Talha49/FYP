// pages/api/register.js
import connectToDatabase from "@/lib/connectdb/connection";
import User from "@/lib/models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET_KEY;

export async function POST(request) {
  try {
    await connectToDatabase();

    const {
      fullName,
      email,
      password,
      contact,
      isSocialLogin = false,
    } = await request.json();

    // Validation
    if (!fullName || !email || !contact || (!isSocialLogin && !password)) {
      return NextResponse.json(
        { error: "Please fill all the required fields" },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "Already have an account with this email." },
        { status: 409 }
      );
    }

    let hashedPassword = null;
    if (!isSocialLogin) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    // Create a new user document
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
      contact,
      isSocialLogin,
    });

    // Generate a JWT token
    const token = jwt.sign(
      { userId: newUser._id, email: newUser.email },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Update the user document with the token
    newUser.token = token;

    // Save the user to the database
    await newUser.save();

    return NextResponse.json(
      {
        message: "User registerd successfully",
        user: {
          id: newUser._id,
          fullName: newUser.fullName, // Changed from 'name' to 'fullName'
          email: newUser.email,
          contact: newUser.contact,
          isSocialLogin: newUser.isSocialLogin,
          token: newUser.token,
        },
      },
      { status: 201 }
    ); // Moved status to the options object
  } catch (error) {
    console.error("Error creating user:", error.message);
    console.error(error.stack);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
