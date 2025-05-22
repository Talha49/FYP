import { NextResponse } from 'next/server';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from '@/lib/firebase/firebaseConfig';
import dbConnect from '@/lib/connectdb/connection';
import NewTask from '../../../../../lib/models/New';
import nodemailer from 'nodemailer';

// Helper function to upload file from base64
const uploadBase64File = async (base64Data, filename) => {
  try {
    const base64Image = base64Data.replace(/^data:image\/\w+;base64,/, ''); // Clean base64 prefix
    const imageBuffer = Buffer.from(base64Image, 'base64');
    const uniqueFilename = `${Date.now()}_${filename}`;
    const storageRef = ref(storage, `Uploads/${uniqueFilename}`);
    const snapshot = await uploadBytes(storageRef, imageBuffer);
    return await getDownloadURL(snapshot.ref);
  } catch (error) {
    console.error(`File upload failed:`, error);
    return null;
  }
};

export async function PUT(req, { params }) {
    try {
        await dbConnect();
        const taskId = params.id;
        const body = await req.json();

        console.log("🔹 Received data for update:", body);

        // Fetch existing task from the database
        const existingTask = await NewTask.findById(taskId);
        if (!existingTask) {
            return NextResponse.json({ success: false, error: 'Task not found' }, { status: 404 });
        }

        // Identify new assignees (users that were not assigned before)
        const previousAssignees = new Set(existingTask.assignees.map(a => a.id.toString()));
        const newAssignees = body.assignees.filter(a => !previousAssignees.has(a.id.toString()));

        // Process ground floor images if base64 provided
        const groundFloorImageUrls = await Promise.all(
            (body.groundFloorImages || []).map(async (image) => {
                if (image.base64) {
                    const uploadedUrl = await uploadBase64File(
                        image.base64,
                        image.name || `ground_floor_${Date.now()}.jpg`
                    );
                    return { url: uploadedUrl };
                }
                return image;
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
                return image;
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
                return attachment;
            })
        );

        // Prepare update data
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
            dueDate: new Date(body.dueDate),
            emailAlerts: body.emailAlerts,
            watchers: body.watchers,
            groundFloorImages: groundFloorImageUrls.filter(Boolean),
            lastFloorImages: lastFloorImageUrls.filter(Boolean),
            attachments: attachmentUrls.filter(Boolean),
            estimatedTime: body.estimatedTime, // Include estimatedTime
        };

        // Update task in the database
        const updatedTask = await NewTask.findByIdAndUpdate(taskId, updateData, { new: true });

        if (!updatedTask) {
            return NextResponse.json({ success: false, error: 'Task update failed' }, { status: 500 });
        }

        const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

        // 🔔 Send notifications & emails only to new assignees
        for (const assignee of newAssignees) {
            const notificationPayload = {
                userId: assignee.id,
                title: `New Task Assigned: ${updatedTask.description}`,
                message: `📌${updatedTask.username} assigned you a new task.
                    \n📂 Task: ${updatedTask.description}
                    \n🔥 Priority: ${updatedTask.priority}
                    \n📌 Status: ${updatedTask.status}
                    \n📅 Due Date: ${new Date(updatedTask.dueDate).toLocaleDateString()}
                    \n⏰ Estimated Time: ${updatedTask.estimatedTime?.hours || 0}h ${updatedTask.estimatedTime?.minutes || 0}m
                `,
                link: `/tasks/${updatedTask._id}`,
                templateName: "taskcreated",
                priority: "high",
                type: "success",
                category: "general",
            };

            // Send notification
            await fetch(`${BASE_URL}/api/notifyApi`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(notificationPayload),
            }).catch(err => console.error("❌ Notification Error:", err));
        }

        return NextResponse.json({ success: true, data: updatedTask }, { status: 200 });

    } catch (error) {
        console.error("❌ Error in PUT /api/New/UpdateTask/[id]:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}