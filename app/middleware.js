// import { NextResponse } from 'next/server';
// import jwt from 'jsonwebtoken';

// const JWT_SECRET = process.env.JWT_SECRET_KEY;

// export async function middleware(request) {
//   const res = NextResponse.next();

//   // Setting CORS headers
//   res.headers.append('Access-Control-Allow-Credentials', 'true');
//   res.headers.append('Access-Control-Allow-Origin', '*'); // replace '*' with your actual origin if needed
//   res.headers.append('Access-Control-Allow-Methods', 'GET, DELETE, PATCH, POST, PUT');
//   res.headers.append(
//     'Access-Control-Allow-Headers',
//     'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
//   );

//   console.log('Middleware is running!');

//   if (request.nextUrl.pathname.startsWith('/api/users')) {
//     const authHeader = request.headers.get('authorization');
//     if (!authHeader) {
//       return NextResponse.json({ error: 'Authorization header missing' }, { status: 401 });
//     }

//     const token = authHeader.split(' ')[1]; // Extract token from "Bearer <token>"
//     try {
//       jwt.verify(token, JWT_SECRET);
//       return res; // Allow the request to proceed
//     } catch (error) {
//       return NextResponse.json({ error: 'Session Expired! Please login again' }, { status: 401 });
//     }
//   }

//   return res; // Allow the request to proceed
// }

// export const config = {
//   matcher: ['/api/users/:path*', '/api/:path*'],
// };


// import { NextResponse } from 'next/server';
// import jwt from 'jsonwebtoken';

// const JWT_SECRET = process.env.JWT_SECRET_KEY;

// export async function middleware(request) {
//   console.log('Middleware is running!');
//   if (request.nextUrl.pathname.startsWith('/api/users')) {
//     const authHeader = request.headers.get('authorization');
//     if (!authHeader) {
//       return NextResponse.json({ error: 'Authorization header missing' }, { status: 401 });
//     }

//     const token = authHeader;
//     try {
//       jwt.verify(token, JWT_SECRET);
//       return null; // Allow the request to proceed
//     } catch (error) {
//       return NextResponse.json({ error: 'Session Expires! Please login again' }, { status: 401 });
//     }
//   }

//   return null; // Allow the request to proceed
// }

// export const config = {
//   matcher: ['/api/users/:path*'],
// };