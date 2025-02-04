import { NextResponse } from 'next/server';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from '@/lib/firebase/firebaseConfig';
import dbConnect from '@/lib/connectdb/connection';
import NewTask from '../../../../../lib/models/New'


export async function PUT(req, { params }) {
    try {
        await dbConnect();
        const taskId = params.id;
        const body = await req.json();

        console.log("Received data for update:", body);

        const updateData = {
            userId: body.userId,
            username: body.username,
            description: body.description,
            priority: body.priority,
            room: body.room,
            floor: body.floor,
            status: body.status,
            tags: body.tags,
            assignees: body.assignees,
            dueDate: body.dueDate,
            emailAlerts: body.emailAlerts,
            watchers: body.watchers,
            groundFloorImages: body.groundFloorImages,
            lastFloorImages: body.lastFloorImages,
            attachments: body.attachments,
        };

        const updatedTask = await NewTask.findByIdAndUpdate(taskId, updateData, { new: true });

        if (!updatedTask) {
            return NextResponse.json({ success: false, error: 'Task not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: updatedTask }, { status: 200 });
    } catch (error) {
        console.error("Error in PUT /api/New/UpdateTask/[id]:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}




// import { NextResponse } from 'next/server';
// import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
// import { storage } from '@/lib/firebase/firebaseConfig';
// import dbConnect from '@/lib/connectdb/connection';
// import NewTask from '../../../../../lib/models/New';

// // Helper function to upload file from base64
// const uploadBase64File = async (base64Data, filename) => {
//   try {
//     const base64Image = base64Data.replace(/^data:image\/\w+;base64,/, ''); // Clean base64 prefix
//     const imageBuffer = Buffer.from(base64Image, 'base64');
//     const uniqueFilename = `${Date.now()}_${filename}`;
//     const storageRef = ref(storage, `uploads/${uniqueFilename}`);
//     const snapshot = await uploadBytes(storageRef, imageBuffer);
//     return await getDownloadURL(snapshot.ref);
//   } catch (error) {
//     console.error(`File upload failed:`, error);
//     return null;
//   }
// };

// export async function PUT(req, { params }) {
//   try {
//     await dbConnect();
//     const taskId = params.id;
//     const body = await req.json();

//     console.log("Received data for update:", body);

//     // Process ground floor images if base64 provided
//     const groundFloorImageUrls = await Promise.all(
//       (body.groundFloorImages || []).map(async (image) => {
//         if (image.base64) {
//           const uploadedUrl = await uploadBase64File(
//             image.base64,
//             image.name || `ground_floor_${Date.now()}.jpg`
//           );
//           return { url: uploadedUrl };
//         }
//         return image; // If no base64, return the existing value
//       })
//     );

//     // Process last floor images
//     const lastFloorImageUrls = await Promise.all(
//       (body.lastFloorImages || []).map(async (image) => {
//         if (image.base64) {
//           const uploadedUrl = await uploadBase64File(
//             image.base64,
//             image.name || `last_floor_${Date.now()}.jpg`
//           );
//           return { url: uploadedUrl };
//         }
//         return image; // Return existing value if no base64
//       })
//     );

//     // Process attachments
//     const attachmentUrls = await Promise.all(
//       (body.attachments || []).map(async (attachment) => {
//         if (attachment.base64) {
//           const uploadedUrl = await uploadBase64File(
//             attachment.base64,
//             attachment.name || `attachment_${Date.now()}`
//           );
//           return { url: uploadedUrl };
//         }
//         return attachment; // Return existing attachment if no base64
//       })
//     );

//     // Update task data
//     const updateData = {
//       ...body,
//       groundFloorImages: groundFloorImageUrls.filter(Boolean),
//       lastFloorImages: lastFloorImageUrls.filter(Boolean),
//       attachments: attachmentUrls.filter(Boolean),
//       dueDate: new Date(body.dueDate)
//     };

//     const updatedTask = await NewTask.findByIdAndUpdate(taskId, updateData, { new: true });

//     if (!updatedTask) {
//       return NextResponse.json({ success: false, error: 'Task not found' }, { status: 404 });
//     }

//     return NextResponse.json({ success: true, data: updatedTask }, { status: 200 });
//   } catch (error) {
//     console.error("Error in PUT /api/New/UpdateTask/[id]:", error);
//     return NextResponse.json({ success: false, error: error.message }, { status: 500 });
//   }
// }
