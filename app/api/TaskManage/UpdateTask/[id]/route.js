import dbConnect from "@/lib/connectdb/connection";
import FieldNoteDB from "@/lib/models/FieldNoteDB";
import { NextResponse } from "next/server";

export async function PUT(req, { params }) {
  await dbConnect();

  try {
    const { id } = params;
    const body = await req.json();
    const {
      user,
      name,
      room,
      floor,
      priority,
      status,
      imageUrl,
      tags,
      description,
      assignee,
      dueDate,
      watchers,
      attachments,
      comments,
    } = body;

    // Check if the field note exists
    const existingFieldNote = await FieldNoteDB.findById(id);
    if (!existingFieldNote) {
      return NextResponse.json(
        { success: false, error: "Field note not found" },
        { status: 404 }
      );
    }

    // Update the field note
    const updatedFieldNote = await FieldNoteDB.findByIdAndUpdate(
      id,
      {
        name,
        room,
        floor,
        priority,
        status,
        imageUrl,
        tags,
        description,
        assignee,
        dueDate,
        watchers,
        attachments,
        comments,
      },
      { new: true, runValidators: true }
    );

    return NextResponse.json(
      { success: true, data: updatedFieldNote },
      { status: 200 }
    );
  } catch (error) {
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return NextResponse.json(
        { success: false, error: errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
