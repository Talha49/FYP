import { NextResponse } from 'next/server';
import NewTask from '../../../../lib/models/New';
import ChatRoom from '../../../../lib/models/chatRoom';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import dbConnect from '@/lib/connectdb/connection';
import { storage } from '@/lib/firebase/firebaseConfig';

export async function POST(req) {
    try {
        await dbConnect();
        const body = await req.formData();

        console.log("Received form data:", Object.fromEntries(body.entries()));

        const uploadFile = async (file, path) => {
            if (!file) return null;
            try {
                const storageRef = ref(storage, `${path}/${file.name}`);
                const snapshot = await uploadBytes(storageRef, file);
                const url = await getDownloadURL(snapshot.ref);
                return url;
            } catch (error) {
                console.error(`Failed to upload ${file.name}:`, error);
                return null;
            }
        };

        const groundFloorImagesUrls = await Promise.all(
            body.getAll('groundFloorImages').map(file => uploadFile(file, 'groundFloorImages'))
        );

        const lastFloorImageUrl = body.get('lastFloorImage')
            ? await uploadFile(body.get('lastFloorImage'), 'lastFloorImages')
            : '';

        const attachmentUrls = await Promise.all(
            body.getAll('attachments').map(file => uploadFile(file, 'attachments'))
        );

        const taskData = {
            userId: body.get('userId'),
            creatorId: body.get('userId'),  // Creator ID (same as userId)
            username: body.get('username'),
            description: body.get('description'),
            priority: body.get('priority'),
            room: body.get('room'),
            floor: body.get('floor'),
            status: body.get('status'),
            tags: JSON.parse(body.get('tags') || '[]'),
            assignees: body.get('assignees'),
            dueDate: body.get('dueDate'),
            emailAlerts: JSON.parse(body.get('emailAlerts') || '[]'),
            watchers: JSON.parse(body.get('watchers') || '[]'),
            groundFloorImages: groundFloorImagesUrls.filter(Boolean).map(url => ({ url })),
            lastFloorImages: lastFloorImageUrl ? [{ url: lastFloorImageUrl }] : [],
            attachments: attachmentUrls.filter(Boolean).map(url => ({ url })),
        };

        const task = await NewTask.create(taskData);

        // Create chat room with taskId instead of chatRoomId
        const chatRoomData = {
            taskId: task._id, // Use taskId instead of chatRoomId
            creatorId: task.userId,
            creatorName: task.username,
            messages: [],
        };
        const chatRoom = await ChatRoom.create(chatRoomData);

        return NextResponse.json({
            success: true,
            task,
            chatRoom
        }, { status: 201 });
    } catch (error) {
        console.error("Detailed error:", error);
        return NextResponse.json({ success: false, error: error.message, stack: error.stack }, { status: 400 });
    }
}
