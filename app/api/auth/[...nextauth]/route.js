import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import User from "@/lib/models/User"; // Import the User model
import dbConnect from "@/lib/connectdb/connection"; // Import your MongoDB connection utility

export const authOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      await dbConnect(); // Ensure a connection to the database

      const existingUser = await User.findOne({ email: user.email });

      if (existingUser) {
        // Update user information if they already exist in the database
        existingUser.fullName = user.name || existingUser.fullName;
        existingUser.image = user.image || existingUser.image;
        existingUser.isSocialLogin = true;
        await existingUser.save();
      } else {
        // Register a new user if they do not exist in the database
        await User.create({
          fullName: user.name,
          email: user.email,
          image: user.image,
          isSocialLogin: true,
        });
      }

      return true; // Allow the sign-in
    },

    async session({ session, token, user }) {
      session.user.id = token.sub;
      return session;
    },

    async jwt({ token, user, account, profile }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
