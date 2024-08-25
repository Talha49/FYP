// pages/api/users/[id].js
import connectToDatabase from '@/lib/connectdb/connection';
import User from '@/lib/models/User';
import { NextResponse } from 'next/server';
import { middleware } from '@/app/middleware';

export async function GET(request, { params }) {
  try {
    // Run the middleware
    const middlewareResponse = await middleware(request);
    if (middlewareResponse instanceof NextResponse) {
      return middlewareResponse;
    }

    const { id } = params;

    // Connect to the database
    await connectToDatabase();

    // Fetch the user by ID from MongoDB
    const user = await User.findById(id).select('fullName email address city contact');

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user); // Return the user object
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
