import dbConnect from "@/lib/connectdb/connection";
import Capture from "@/lib/models/Capture";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { user, floor, captureType, captureName, imageUrl } = body;

    if (!user || !floor || !captureType || !captureName || !imageUrl) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const capture = await Capture.create(body);
    return NextResponse.json(capture, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create capture" },
      { status: 500 }
    );
  }
}
