import dbConnect from "@/lib/connectdb/connection";
import VTour from "@/lib/models/VTour";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { name, description, videoUrl, frames, inspectionId } = await req.json();
    if (
      !name ||
      !description ||
      !videoUrl ||
      frames.length === 0 ||
      !inspectionId
    ) {
      return NextResponse.json(
        {
          message: "All fields are required",
        },
        { status: 400 }
      );
    }
    await dbConnect();
    const virtualTour = new VTour({
      name,
      description,
      videoUrl,
      frames,
      inspectionId,
    });
    await virtualTour.save();
    return NextResponse.json(
      {
        message: "Virtual Tour created successfully",
        virtualTour,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "Failed to create Virtual Tour",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
