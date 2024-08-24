import { middleware } from '@/app/middleware';
import pool from '@/lib/middlewares/connection';
import { NextResponse } from 'next/server';

export async function PUT(request, { params }) {
  try {
    const middlewareResponse = await middleware(request);
    if (middlewareResponse instanceof NextResponse) {
      return middlewareResponse;
    }

    const { id } = params;
    const { name, address, city, contact } = await request.json();

    // Validation
    if (!name || !address || !city || !contact) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const [result] = await pool.query(
      'UPDATE users SET name = ?, address = ?, city = ?, contact = ? WHERE user_id = ?',
      [name, address, city, contact, id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ id, name, address, city, contact });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}