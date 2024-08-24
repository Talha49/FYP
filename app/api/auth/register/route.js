import pool from "@/lib/middlewares/connection";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET_KEY; // Ensure this is set in your environment variables

export async function POST(request) {
  try {
    const { name, email, password, contact, isSocialLogin = false } = await request.json();

    // Validation
    if (!name || !email || !contact || (!isSocialLogin && !password)) {
      return NextResponse.json(
        { error: "Please fill all the required fields" },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    let hashedPassword = null;
    if (!isSocialLogin) {
      // Hash the password if it's not a social login
      hashedPassword = await bcrypt.hash(password, 10);
    }

    // Start a transaction
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      const [result] = await connection.query(
        "INSERT INTO users (name, email, password, contact, isSocialLogin) VALUES (?, ?, ?, ?, ?)",
        [name, email, hashedPassword, contact, isSocialLogin]
      );

      const userId = result.insertId;

      // Commit the transaction
      await connection.commit();

      // Generate a JWT token if needed
      const token = jwt.sign({ userId, email }, JWT_SECRET, { expiresIn: "1d" });

      // Update the token in the database
      await connection.query("UPDATE users SET token = ? WHERE user_id = ?", [token, userId]);

      return NextResponse.json({
        message: "User created successfully",
        status: 201,
        user: {
          id: userId,
          name,
          email,
          contact,
          isSocialLogin,
          token,
        },
      });
    } catch (error) {
      await connection.rollback();
      if (error.code === "ER_DUP_ENTRY") {
        return NextResponse.json({ error: "Email already in use" }, { status: 409 });
      }
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
