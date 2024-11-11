import { NextResponse } from 'next/server';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from '@/lib/firebase/firebaseConfig';
import dbConnect from '@/lib/connectdb/connection';
import NewTask from '../../../../lib/models/New'

export async function POST(req) {
    try {
        await dbConnect();
        const body = await req.formData();

        const taskId = body.get('taskId');
        const files = body.getAll('attachments');

        const uploadFile = async (file) => {
            if (!file) return null;
            try {
                const storageRef = ref(storage, `attachments/${file.name}`);
                const snapshot = await uploadBytes(storageRef, file);
                const url = await getDownloadURL(snapshot.ref);
                console.log(`Uploaded ${file.name} to attachments. URL: ${url}`);
                return { url };
            } catch (error) {
                console.error(`Failed to upload ${file.name}:`, error);
                return null;
            }
        };

        const newAttachments = await Promise.all(files.map(uploadFile));
        const validAttachments = newAttachments.filter(Boolean);

        const task = await NewTask.findById(taskId);
        if (!task) {
            return NextResponse.json({ success: false, error: 'Task not found' }, { status: 404 });
        }

        task.attachments = [...task.attachments, ...validAttachments];
        await task.save();

        return NextResponse.json({ success: true, data: { attachments: validAttachments } }, { status: 200 });
    } catch (error) {
        console.error("Error in POST /api/New/AddAttachments:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}