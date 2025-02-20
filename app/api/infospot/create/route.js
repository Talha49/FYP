import dbConnect from "@/lib/connectdb/connection";
import Infospot from "@/lib/models/Infospot";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { title, description, position, frame_id, vt_id } = await req.json();
    if (!title || !description || !position || !frame_id || !vt_id) {
      return NextResponse.json(
        {
          message:
            "All fields (title, description, position, frame_id, vt_id) are required.",
        },
        { status: 400 }
      );
    }
    if (!position.x || !position.y || !position.z) {
      return NextResponse.json(
        {
          message: "Position (x, y, z) is required and must be valid numbers.",
        },
        { status: 400 }
      );
    }
    await dbConnect();
    const newInfospot = await Infospot.create({
      title,
      description,
      position,
      frame_id,
      vt_id,
    });
    await newInfospot.save();
    return NextResponse.json(
      { message: "Infospot created successfully", newInfospot },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({
      message: "faied to create infospot",
      error: error.message,
    });
  }
}
