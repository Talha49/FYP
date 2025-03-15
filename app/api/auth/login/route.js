import { NextResponse } from "next/server";

import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dbConnect from "@/lib/connectdb/connection";
import User from "@/lib/models/User";

const JWT_SECRET = process.env.JWT_SECRET_KEY;


export async function POST(req) {
  try {
    const { email, password } = await req.json();
    
    if (!email || !password) {
      return NextResponse.json({ message: "Email and password are required" }, { status: 400 });
    }

    await dbConnect();
    const user = await User.findOne({ email }).exec();

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    if (user.status === "inactive") {
      return NextResponse.json({ message: "Account is inactive, please contact admin" }, { status: 403 });
    }

    if (user.isSocialLogin) {
      return NextResponse.json({ message: "Please use social login for this account" }, { status: 400 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    // Generate JWT token for mobile authentication
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: "1d" } // Token valid for 1 days
    );
  
    return NextResponse.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        contact: user.contact,
        isSocialLogin: user.isSocialLogin,
        image: user.image,
       
      },
    }, { status: 200 });


  
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

