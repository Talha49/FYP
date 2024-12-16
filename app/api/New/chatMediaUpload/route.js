// app/api/New/chatMediaUpload/route.js
import { storage } from "../../../../lib/firebase/firebaseConfig"; // Adjust the import if needed
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

// POST method to handle file uploads
export async function POST(req) {
  try {
    // Parse the incoming FormData
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return new Response("No file uploaded", { status: 400 });
    }

    // Create a reference to the Firebase Storage location
    const storageRef = ref(storage, `chat_media/${Date.now()}_${file.name}`);

    // Upload the file to Firebase
    const uploadTask = uploadBytesResumable(storageRef, file);

    // Wait for the upload to complete
    const snapshot = await uploadTask;
    const downloadURL = await getDownloadURL(snapshot.ref);

    // Return the file's download URL
    return new Response(
      JSON.stringify({ url: downloadURL, fileName: file.name }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error uploading media:", error);
    return new Response("Error uploading file", { status: 500 });
  }
}
