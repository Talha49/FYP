import dbConnect from "@/lib/connectdb/connection";
import User from "@/lib/models/User";

export async function POST(req) {
  try {
    // Parse request body
    const body = await req.json();
    const { fullName, email, address, city, contact, image } = body;

    // Connect to the database
    await dbConnect();

    // Update the user in the database
    const updatedUser = await User.findOneAndUpdate(
      { email }, // Find user by email
      { fullName, address, city, contact, image }, // Fields to update
      { new: true } // Return the updated document
    );

    if (!updatedUser) {
      return new Response(JSON.stringify({ message: "User not found" }), {
        status: 404,
      });
    }

    return new Response(
      JSON.stringify({ message: "Profile updated successfully", updatedUser }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating profile:", error);
    return new Response(
      JSON.stringify({ message: "Internal Server Error", error: error.message }),
      { status: 500 }
    );
  }
}
