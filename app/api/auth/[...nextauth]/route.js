import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import User from "@/lib/models/User";
import dbConnect from "@/lib/connectdb/connection";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import { NextResponse } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET_KEY;

export const authOptions = {
  session: {
    strategy: "jwt",
    maxmaxAge: 24 * 60 * 60, // 1 day
  },
  providers: [
    CredentialsProvider({
      id: "login",
      name: "login",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        console.log("Login => ", credentials);
        try {
          await dbConnect();

          const { email, password } = credentials;

          const user = await User.findOne({ email }).exec();

          if (!user) {
            console.log("User not found");
            throw new Error("User not found");
          }

          if (user.isSocialLogin) {
            console.log("User is a social login account");
            throw new Error("Please use social login for this account");
          }

          const isPasswordValid = await bcrypt.compare(password, user.password);
          if (!isPasswordValid) {
            console.log("Invalid password");
            throw new Error("Invalid password");
          }

          // Generate token (optional here as token is already managed by JWT callback)
          const token = jwt.sign(
            { userId: user._id, email: user.email },
            JWT_SECRET,
            { expiresIn: "1d" }
          );
          user.token = token;
          await user.save();

          // Return user object to be stored in JWT
          return user;
        } catch (error) {
          console.error("Authentication error:", error.message);
          throw error;
        }
      },
    }),
    CredentialsProvider({
      id: "register",
      name: "register",
      credentials: {
        fullName: { label: "Name", type: "text" },
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
        contact: { label: "Contact", type: "tel" },
      },
      async authorize(credentials) {
        console.log("Register =>", credentials);
        try {
          await dbConnect();

          const { fullName, email, password, contact } = credentials;

          // Check if user already exists
          const existingUser = await User.findOne({ email }).exec();
          if (existingUser) {
            throw new Error("Already have an account with this email.");
          }

          // Hash password before saving to database
          const hashedPassword = await bcrypt.hash(password, 10);

          // Create new user in the database
          const newUser = new User({
            fullName,
            email,
            password: hashedPassword,
            contact,
            isSocialLogin: false, // Explicitly mark as non-social login
          });

          console.log("New user before saving =>", newUser);

          const token = jwt.sign(
            { userId: newUser._id, email: newUser.email },
            JWT_SECRET,
            { expiresIn: "1d" }
          );
          newUser.token = token;

          await newUser.save();

          console.log("New user after saving =>", newUser);

          // Return the user to NextAuth (to be stored in JWT)
          return newUser;
        } catch (error) {
          console.error("Registration error:", error.message);
          throw error;
        }
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "select_account", // Force Google to show the account picker
        },
      },
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        await dbConnect();
  
        const existingUser = await User.findOne({ email: user.email });
        let userData;
  
        // Check if login is via a social provider (Google or Facebook)
        const isSocialLogin =
          account.provider !== "login" && account.provider !== "register"; // CredentialsProvider has id "login"
  
        if (existingUser) {
          existingUser.fullName = user.name || existingUser.fullName;
          existingUser.image = user.image || existingUser.image;
  
          // Update isSocialLogin only for social logins
          if (isSocialLogin) {
            existingUser.isSocialLogin = true;
          }
  
          const token = jwt.sign(
            { userId: existingUser._id, email: existingUser.email },
            JWT_SECRET,
            { expiresIn: "1d" }
          );
          existingUser.token = token;
          await existingUser.save();
          userData = {
            id: existingUser._id,
            fullName: existingUser.fullName,
            email: existingUser.email,
            image: existingUser.image,
            isSocialLogin: existingUser.isSocialLogin,
            token: existingUser.token,
            contact: existingUser.contact,
            address: existingUser.address,
            city: existingUser.city,
            createdAt: existingUser.createdAt,
          };
        } else {
          const newUser = new User({
            fullName: user.name,
            email: user.email,
            image: user.image,
            isSocialLogin, // Set true if social login, false for credentials
          });
          const token = jwt.sign(
            { userId: newUser._id, email: newUser.email },
            JWT_SECRET,
            { expiresIn: "1d" }
          );
          newUser.token = token;
          await newUser.save();
          userData = {
            id: newUser._id,
            fullName: newUser.fullName,
            email: newUser.email,
            image: newUser.image,
            isSocialLogin: newUser.isSocialLogin,
            token: newUser.token,
            contact: newUser.contact,
            address: newUser.address,
            city: newUser.city,
            createdAt: newUser.createdAt,
          };
        }
  
        // Attach userData to the user object for JWT and session callbacks
        user.userData = userData;
  
        return true;
      } catch (error) {
        console.error("Error during sign in:", error);
        return false;
      }
    },
  
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.userData = user.userData; // Pass all fields to the token
      }
  
      return token;
    },
  
    async session({ session, token }) {
      if (token) {
        session.accessToken = token.accessToken;
        session.refreshToken = token.refreshToken;
        session.user.id = token.id;
    
        // Fetch updated user data from the database
        await dbConnect();
        const updatedUser = await User.findOne({ email: token.userData.email }).lean();
    
        session.user.userData = {
          id: updatedUser._id,
          fullName: updatedUser.fullName,
          email: updatedUser.email,
          image: updatedUser.image,
          isSocialLogin: updatedUser.isSocialLogin,
          token: updatedUser.token,
          contact: updatedUser.contact,
          address: updatedUser.address,
          city: updatedUser.city,
          createdAt: updatedUser.createdAt,
        };
      }
    
      return session;
    },
  },
  
  pages: {
    signIn: "/Auth",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
