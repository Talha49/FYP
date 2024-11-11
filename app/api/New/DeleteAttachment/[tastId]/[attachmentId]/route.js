import { NextResponse } from "next/server";
import dbConnect from "@/lib/connectdb/connection";
import NewTask from "../../../../../../lib/models/New";
export async function DELETE(req, { params }) {
  try {
    await dbConnect();
    const { taskId, attachmentId } = params;

    const task = await NewTask.findById(taskId);
    if (!task) {
      return NextResponse.json(
        { success: false, error: "Task not found" },
        { status: 404 }
      );
    }

    // Filter out the attachment with the matching ID
    task.attachments = task.attachments.filter(
      (attachment) => attachment._id.toString() !== attachmentId
    );

    await task.save();

    return NextResponse.json(
      {
        success: true,
        data: task,
        message: "Attachment deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in DELETE /api/New/DeleteAttachment:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
