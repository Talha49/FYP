import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import User from "@/lib/models/User";
import dbConnect from "@/lib/connectdb/connection";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET_KEY;

export const authOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
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

        if (existingUser) {
          existingUser.fullName = user.name || existingUser.fullName;
          existingUser.image = user.image || existingUser.image;
          existingUser.isSocialLogin = true;
          await existingUser.save();
        } else {
          const newUser = new User({
            fullName: user.name,
            email: user.email,
            image: user.image,
            isSocialLogin: true,
          });
          const token = jwt.sign(
            { userId: newUser._id, email: newUser.email },
            JWT_SECRET,
            { expiresIn: "1d" }
          );
          newUser.token = token;
          await newUser.save();
        }

        return true;
      } catch (error) {
        console.error("Error during sign in:", error);
        return false;
      }
    },

    async jwt({ token, user, account }) {
      // Add the access token and refresh token to the token object
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
      }

      if (user) {
        token.id = user.id;
      }

      return token;
    },

    async session({ session, token }) {
      // Attach the access token to the session
      if (token) {
        session.accessToken = token.accessToken;
        session.refreshToken = token.refreshToken; // optional if you need a refresh token
        session.user.id = token.sub;
      }

      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
