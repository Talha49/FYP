import { middleware } from '@/app/middleware';
import pool from '@/lib/middlewares/connection';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    // Pass the request object to the middleware function
    const middlewareResponse = await middleware(request);
    if (middlewareResponse instanceof NextResponse) {
      return middlewareResponse;
    }

    const [rows] = await pool.query(
      `SELECT user_id, name, email, contact, address, city, created_at, updated_at, isSocialLogin 
       FROM users`
    );
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}