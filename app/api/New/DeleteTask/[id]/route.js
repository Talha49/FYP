import dbConnect from "@/lib/connectdb/connection";
import { NextResponse } from "next/server";
import NewTask from "../../../../../lib/models/New";

export async function DELETE(req, { params }) {
  try {
    await dbConnect();
    const { id } = params;

    // Check if the task exists
    const task = await NewTask.findById(id);
    if (!task) {
      return NextResponse.json({ error: "Task not found." }, { status: 404 });
    }

    // Delete the task
    await NewTask.findByIdAndDelete(id);
    return NextResponse.json({
      success: true,
      message: "Task deleted successfully!",
    });
  } catch (error) {
    console.log("Error deleting task: ", error);
    return NextResponse.json(
      { error: "Failed to delete task." },
      { status: 500 }
    );
  }
}
