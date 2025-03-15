// import { NextResponse } from 'next/server';
// import NewTask from '../../../../lib/models/New';
// import ChatRoom from '../../../../lib/models/chatRoom';
// import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
// import dbConnect from '@/lib/connectdb/connection';
// import { storage } from '@/lib/firebase/firebaseConfig';

// export async function POST(req) {
//     try {
//         await dbConnect();
//         const body = await req.formData();

//         console.log("Received form data:", Object.fromEntries(body.entries()));

//         const uploadFile = async (file, path) => {
//             if (!file) return null;
//             try {
//                 const storageRef = ref(storage, `${path}/${file.name}`);
//                 const snapshot = await uploadBytes(storageRef, file);
//                 const url = await getDownloadURL(snapshot.ref);
//                 return url;
//             } catch (error) {
//                 console.error(`Failed to upload ${file.name}:`, error);
//                 return null;
//             }
//         };

//         const groundFloorImagesUrls = await Promise.all(
//             body.getAll('groundFloorImages').map(file => uploadFile(file, 'groundFloorImages'))
//         );

//         const lastFloorImageUrl = body.get('lastFloorImage')
//             ? await uploadFile(body.get('lastFloorImage'), 'lastFloorImages')
//             : '';

//         const attachmentUrls = await Promise.all(
//             body.getAll('attachments').map(file => uploadFile(file, 'attachments'))
//         );

//         const taskData = {
//             userId: body.get('userId'),
//             creatorId: body.get('userId'),  // Creator ID (same as userId)
//             username: body.get('username'),
//             description: body.get('description'),
//             priority: body.get('priority'),
//             room: body.get('room'),
//             floor: body.get('floor'),
//             status: body.get('status'),
//             tags: JSON.parse(body.get('tags') || '[]'),
//             assignees:  JSON.parse(body.get('assignees') || '[]'),
//             dueDate: body.get('dueDate'),
//             emailAlerts: JSON.parse(body.get('emailAlerts') || '[]'),
//             watchers: JSON.parse(body.get('watchers') || '[]'),
//             groundFloorImages: groundFloorImagesUrls.filter(Boolean).map(url => ({ url })),
//             lastFloorImages: lastFloorImageUrl ? [{ url: lastFloorImageUrl }] : [],
//             attachments: attachmentUrls.filter(Boolean).map(url => ({ url })),
//         };

//         const task = await NewTask.create(taskData);

//         // Create chat room with taskId instead of chatRoomId
//         const chatRoomData = {
//             taskId: task._id, // Use taskId instead of chatRoomId
//             creatorId: task.userId,
//             creatorName: task.username,
//             messages: [],
//         };
//         const chatRoom = await ChatRoom.create(chatRoomData);

//         return NextResponse.json({
//             success: true,
//             task,
//             chatRoom
//         }, { status: 201 });
//     } catch (error) {
//         console.error("Detailed error:", error);
//         return NextResponse.json({ success: false, error: error.message, stack: error.stack }, { status: 400 });
//     }
// }

// import { NextResponse } from 'next/server';
// import NewTask from '../../../../lib/models/New';
// import ChatRoom from '../../../../lib/models/chatRoom';
// import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
// import dbConnect from '@/lib/connectdb/connection';
// import { storage } from '@/lib/firebase/firebaseConfig';

// export async function POST(req) {
//     try {
//         await dbConnect();
//         const body = await req.json(); // Parse JSON instead of FormData

//         const uploadFile = async (file) => {
//             try {
//                 const response = await fetch(file.uri);
//                 const blob = await response.blob();
//                 const storageRef = ref(storage, `uploads/${file.name}`);
//                 const snapshot = await uploadBytes(storageRef, blob);
//                 return await getDownloadURL(snapshot.ref);
//             } catch (error) {
//                 console.error(`Failed to upload ${file.name}:`, error);
//                 return null;
//             }
//         };

//         const groundFloorImagesUrls = body.groundFloorImages ?
//             await Promise.all(body.groundFloorImages.map(uploadFile)) : [];

//         const lastFloorImageUrl = body.lastFloorImages && body.lastFloorImages.length
//             ? await uploadFile(body.lastFloorImages[0])
//             : '';

//         const attachmentUrls = body.attachments ?
//             await Promise.all(body.attachments.map(uploadFile)) : [];

//         const taskData = {
//             ...body,
//             groundFloorImages: groundFloorImagesUrls
//                 .filter(Boolean)
//                 .map(url => ({ url })),
//             lastFloorImages: lastFloorImageUrl
//                 ? [{ url: lastFloorImageUrl }]
//                 : [],
//             attachments: attachmentUrls
//                 .filter(Boolean)
//                 .map(url => ({ url })),
//         };

//         const task = await NewTask.create(taskData);

//         const chatRoomData = {
//             taskId: task._id,
//             creatorId: task.userId,
//             creatorName: task.username,
//             messages: [],
//         };
//         const chatRoom = await ChatRoom.create(chatRoomData);

//         return NextResponse.json({
//             success: true,
//             task,
//             chatRoom
//         }, { status: 201 });
//     } catch (error) {
//         console.error("Detailed error:", error);
//         return NextResponse.json({
//             success: false,
//             error: error.message
//         }, { status: 400 });
//     }
// }

import { NextResponse } from "next/server";
import NewTask from "../../../../lib/models/New";
import ChatRoom from "../../../../lib/models/chatRoom";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import dbConnect from "@/lib/connectdb/connection";
import { storage } from "@/lib/firebase/firebaseConfig";

// Helper function to upload file from base64
const uploadBase64File = async (base64Data, filename) => {
  try {
    // Remove data URL prefix if exists
    const base64Image = base64Data.replace(/^data:image\/\w+;base64,/, "");

    // Convert base64 to buffer
    const imageBuffer = Buffer.from(base64Image, "base64");

    // Generate unique filename
    const uniqueFilename = `${Date.now()}_${filename}`;

    // Create storage reference
    const storageRef = ref(storage, `uploads/${uniqueFilename}`);

    // Upload to Firebase
    const snapshot = await uploadBytes(storageRef, imageBuffer);

    // Get download URL
    return await getDownloadURL(snapshot.ref);
  } catch (error) {
    console.error(`File upload failed:`, error);
    return null;
  }
};

export async function POST(req) {
  try {
    // Connect to database
    await dbConnect();

    // Parse JSON body
    const body = await req.json();

    // Process ground floor images
    const groundFloorImageUrls = await Promise.all(
      (body.groundFloorImages || []).map(async (image) => {
        if (image.base64) {
          const uploadedUrl = await uploadBase64File(
            image.base64,
            image.name || `ground_floor_${Date.now()}.jpg`
          );
          return { url: uploadedUrl };
        }
        return null;
      })
    );

    // Process last floor images
    const lastFloorImageUrls = await Promise.all(
      (body.lastFloorImages || []).map(async (image) => {
        if (image.base64) {
          const uploadedUrl = await uploadBase64File(
            image.base64,
            image.name || `last_floor_${Date.now()}.jpg`
          );
          return { url: uploadedUrl };
        }
        return null;
      })
    );

    // Process attachments
    const attachmentUrls = await Promise.all(
      (body.attachments || []).map(async (attachment) => {
        if (attachment.base64) {
          const uploadedUrl = await uploadBase64File(
            attachment.base64,
            attachment.name || `attachment_${Date.now()}`
          );
          return { url: uploadedUrl };
        }
        return null;
      })
    );

    // Prepare task data
    const taskData = {
      ...body,
      groundFloorImages: groundFloorImageUrls.filter(Boolean),
      lastFloorImages: lastFloorImageUrls.filter(Boolean),
      attachments: attachmentUrls.filter(Boolean),
      dueDate: new Date(body.dueDate),
    };

    // Create task
    const task = await NewTask.create(taskData);

    // Create chat room
    const chatRoomData = {
      taskId: task._id,
      creatorId: task.userId,
      creatorName: task.username,
      messages: [],
    };
    const chatRoom = await ChatRoom.create(chatRoomData);

    return NextResponse.json(
      {
        success: true,
        task,
        chatRoom,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Detailed error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        stack: error.stack,
      },
      { status: 400 }
    );
  }
}
