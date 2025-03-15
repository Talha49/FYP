import dbConnect from "@/lib/connectdb/connection";
import User from "@/lib/models/User";

export async function GET(req) {
  try {
    await dbConnect();

    // Get the email from the query parameters
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return new Response(
        JSON.stringify({ message: "Email is required" }),
        { status: 400 }
      );
    }

    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return new Response(
        JSON.stringify({ message: "User not found" }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({ message: "User fetched successfully", user }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching user:", error);
    return new Response(
      JSON.stringify({ message: "Internal Server Error", error: error.message }),
      { status: 500 }
    );
  }
}
