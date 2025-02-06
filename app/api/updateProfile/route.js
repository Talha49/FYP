import dbConnect from "@/lib/connectdb/connection";
import User from "@/lib/models/User";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase/firebaseConfig";

export async function POST(req) {
  try {
    // Parse request body
    const body = await req.json();
    const { fullName, email, address, city, contact, image } = body;

    // Connect to the database
    await dbConnect();

    let imageUrl = null;

    // If an image is provided and it's in Base64 format, upload it to Firebase
    if (image && image.startsWith("data:image")) {
      const buffer = Buffer.from(image.split(",")[1], "base64"); // Convert Base64 to Buffer
      const fileName = `profile_${Date.now()}.jpg`;
      const storageRef = ref(storage, `profileImages/${fileName}`);

      // Upload image to Firebase
      await uploadBytes(storageRef, buffer, { contentType: "image/jpeg" });

      // Get image URL
      imageUrl = await getDownloadURL(storageRef);
    }

    // Update the user in the database
    const updatedUser = await User.findOneAndUpdate(
      { email }, // Find user by email
      {
        fullName,
        address,
        city,
        contact,
        image: imageUrl || image, // Use new URL or existing image URL
      },
      { new: true } // Return the updated document
    );

    if (!updatedUser) {
      return new Response(JSON.stringify({ message: "User not found" }), {
        status: 404,
      });
    }

    return new Response(
      JSON.stringify({
        message: "Profile updated successfully",
        updatedUser,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating profile:", error);
    return new Response(
      JSON.stringify({
        message: "Internal Server Error",
        error: error.message,
      }),
      { status: 500 }
    );
  }
}
