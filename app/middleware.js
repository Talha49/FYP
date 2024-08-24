import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET_KEY;

export async function middleware(request) {
  console.log('Middleware is running!');
  if (request.nextUrl.pathname.startsWith('/api/users')) {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Authorization header missing' }, { status: 401 });
    }

    const token = authHeader;
    try {
      jwt.verify(token, JWT_SECRET);
      return null; // Allow the request to proceed
    } catch (error) {
      return NextResponse.json({ error: 'Session Expires! Please login again' }, { status: 401 });
    }
  }

  return null; // Allow the request to proceed
}

export const config = {
  matcher: ['/api/users/:path*'],
};