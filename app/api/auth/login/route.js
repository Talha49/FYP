import pool from "@/lib/middlewares/connection";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET_KEY; // Ensure this is set in your .env file

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: "Please fill all the required fields" },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }

    // Fetch user from the database
    const [user] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);

    if (user.length === 0) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const foundUser = user[0];

    // Compare the provided password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, foundUser.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Generate a JWT token
    const token = jwt.sign(
      { userId: foundUser.user_id, email: foundUser.email },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Update the user's token in the database
    await pool.query("UPDATE users SET token = ? WHERE user_id = ?", [token, foundUser.user_id]);

    // Return the user details and token
    return NextResponse.json({
      message: "Login successful",
      user: {
        id: foundUser.user_id,
        name: foundUser.name,
        email: foundUser.email,
        contact: foundUser.contact,
        address: foundUser.address,
        city: foundUser.city,
        created_at: foundUser.created_at,
        updated_at: foundUser.updated_at,
        isSocialLogin: foundUser.isSocialLogin,
      },
      token,
    });
  } catch (error) {
    console.error("Error during login:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
