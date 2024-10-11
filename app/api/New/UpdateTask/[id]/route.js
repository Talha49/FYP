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
            assignee: body.assignee,
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

