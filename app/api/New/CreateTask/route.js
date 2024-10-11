// import { NextResponse } from 'next/server'; // Import NextResponse
// import NewTask  from '../../../../lib/models/New'
// import dbConnect from '@/lib/connectdb/connection';

// export async function POST(req) {
//     try {
//         await dbConnect(); 
//         const body = await req.json(); 
//         const propertyInspection = await NewTask.create(body); 
        
        
//         return NextResponse.json({ success: true, data: propertyInspection }, { status: 201 });
//     } catch (error) {
      
//         console.error("Error creating task:", error);
//         return NextResponse.json({ success: false, error: error.message }, { status: 400 });
//     }
// }


import { NextResponse } from 'next/server';
import NewTask from '../../../../lib/models/New'
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import dbConnect from '@/lib/connectdb/connection';
import { storage } from '@/lib/firebase/firebaseConfig';



export async function POST(req) {
    try {
        await dbConnect();
        const body = await req.formData();

        console.log("Received form data:", Object.fromEntries(body.entries()));

        // Handle file uploads
       const uploadFile = async (file, path) => {
    if (!file) return null;
    try {
        const storageRef = ref(storage, `${path}/${file.name}`);
        const snapshot = await uploadBytes(storageRef, file);
        const url = await getDownloadURL(snapshot.ref);
        console.log(`Uploaded ${file.name} to ${path}. URL: ${url}`);
        return url;
    } catch (error) {
        console.error(`Failed to upload ${file.name}:`, error);
        return null; // Return null in case of an error
    }
};


        const groundFloorImagesUrls = await Promise.all(
            body.getAll('groundFloorImages').map(file => uploadFile(file, 'groundFloorImages'))
        );

        let lastFloorImageUrl = '';
        const lastFloorImage = body.get('lastFloorImage');
        if (lastFloorImage) {
            lastFloorImageUrl = await uploadFile(lastFloorImage, 'lastFloorImages');
        }

        const attachmentUrls = await Promise.all(
            body.getAll('attachments').map(file => uploadFile(file, 'attachments'))
        );

        // Prepare task data
        const taskData = {
            userId: body.get('userId'), // Convert userId to ObjectId
            username: body.get('username'),
            description: body.get('description'),
            priority: body.get('priority'),
            room: body.get('room'),
            floor: body.get('floor'),
            status: body.get('status'),
            tags: JSON.parse(body.get('tags') || '[]'),
            assignee: body.get('assignee'),
            dueDate: body.get('dueDate'),
            emailAlerts: JSON.parse(body.get('emailAlerts') || '[]'),
            watchers: JSON.parse(body.get('watchers') || '[]'),
            groundFloorImages: groundFloorImagesUrls.filter(Boolean).map(url => ({ url })),
            lastFloorImages: lastFloorImageUrl ? [{ url: lastFloorImageUrl }] : [],
            attachments: attachmentUrls.filter(Boolean).map(url => ({ url })),
        };

        console.log("Prepared task data:", taskData);

        // Create the task
        const task = await NewTask.create(taskData);
        
        return NextResponse.json({ success: true, data: task }, { status: 201 });
    } catch (error) {
        console.error("Detailed error:", error);
        return NextResponse.json({ success: false, error: error.message, stack: error.stack }, { status: 400 });
    }
}
