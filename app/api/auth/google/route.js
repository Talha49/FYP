import { getServerSession } from "next-auth/next";
import { authOptions } from "../[...nextauth]/route";
import dbConnect from "@/lib/connectdb/connection";
import User from "@/lib/models/User";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { id_token } = req.body;
  if (!id_token) {
    return res.status(400).json({ error: "ID Token is required" });
  }

  try {
    // Verify token with NextAuth.js
    const session = await getServerSession(req, res, authOptions);

    if (!session?.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    await dbConnect();
    let user = await User.findOne({ email: session.user.email });

    if (!user) {
      user = new User({
        fullName: session.user.name,
        email: session.user.email,
        image: session.user.image,
        isSocialLogin: true,
      });
      await user.save();
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1d" }
    );

    res.status(200).json({ user, token });
  } catch (error) {
    console.error("Google login error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
