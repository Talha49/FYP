// pages/api/users/index.js
import connectToDatabase from '@/lib/connectdb/connection';
import User from '@/lib/models/User';
import { NextResponse } from 'next/server';
import { middleware } from '@/app/middleware';

export async function GET(request) {
  try {
    // Pass the request object to the middleware function
    const middlewareResponse = await middleware(request);
    if (middlewareResponse instanceof NextResponse) {
      return middlewareResponse;
    }

    // Connect to the database
    await connectToDatabase();

    // Fetch all users from MongoDB
    const users = await User.find({}, 'fullName email contact address city createdAt updatedAt isSocialLogin');

    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
