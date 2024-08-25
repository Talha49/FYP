// pages/api/users/[id].js
import connectToDatabase from '@/lib/connectdb/connection';
import User from '@/lib/models/User';
import { NextResponse } from 'next/server';
import { middleware } from '@/app/middleware';

export async function PUT(request, { params }) {
  try {
    // Run the middleware
    const middlewareResponse = await middleware(request);
    if (middlewareResponse instanceof NextResponse) {
      return middlewareResponse;
    }

    const { id } = params;
    const { fullName, address, city, contact } = await request.json();

    // Validation
    if (!fullName || !address || !city || !contact) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    // Connect to the database
    await connectToDatabase();

    // Find the user by ID and update the fields
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { fullName, address, city, contact },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      id: updatedUser._id,
      fullName: updatedUser.fullName,
      address: updatedUser.address,
      city: updatedUser.city,
      contact: updatedUser.contact,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
