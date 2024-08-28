// pages/api/login.js
import mongoose from 'mongoose';
import connectToDatabase from '@/lib/connectdb/connection';
import User from '@/lib/models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET_KEY; // Ensure this is set in your .env file

export async function POST(req) {
  try {
    await connectToDatabase();

    const { email, password } = await req.json();

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Please fill all the required fields' },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    // Fetch user from the database
    const user = await User.findOne({ email }).exec();

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Compare the provided password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Generate a JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Update the user's token in the database
    user.token = token;
    await user.save();

    // Return the user details and token
    return NextResponse.json({
      message: 'Login successful',
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        contact: user.contact,
        image: user.image,
        address: user.address,
        city: user.city,
        created_at: user.created_at,
        updated_at: user.updated_at,
        isSocialLogin: user.isSocialLogin,
      },
      token,
    });
  } catch (error) {
    console.error('Error during login:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
