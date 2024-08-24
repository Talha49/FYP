import { middleware } from '@/app/middleware';
import pool from '@/lib/middlewares/connection';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  try {
    const middlewareResponse = await middleware(request);
    if (middlewareResponse instanceof NextResponse) {
      return middlewareResponse;
    }

    const { id } = params;
    const [result] = await pool.query('SELECT user_id, name, email, address, city, contact FROM users WHERE user_id = ?', [id]);

    if (result.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(result[0]); // Return the first (and only) user object
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
