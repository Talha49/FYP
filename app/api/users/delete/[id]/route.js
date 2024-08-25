// pages/api/users/[id].js
import connectToDatabase from '@/lib/connectdb/connection';
import User from '@/lib/models/User';
import { NextResponse } from 'next/server';
import { middleware } from '@/app/middleware';

export async function DELETE(request, { params }) {
  try {
    // Run the middleware
    const middlewareResponse = await middleware(request);
    if (middlewareResponse instanceof NextResponse) {
      return middlewareResponse;
    }

    const { id } = params;

    // Connect to the database
    await connectToDatabase();

    // Find and delete the user by ID
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
