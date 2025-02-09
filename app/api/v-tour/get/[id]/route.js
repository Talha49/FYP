import dbConnect from "@/lib/connectdb/connection";
import VTour from "@/lib/models/VTour";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { message: "Missing virtual tour ID" },
        { status: 400 }
      );
    }
    await dbConnect();
    const virtualTours = await VTour.find({
      inspectionId: id,
    });
    if (!virtualTours) {
      return NextResponse.json(
        { message: "Virtual tours not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      {
        message: "Virtual tours fetched successfully",
        virtualTours,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "Failed to get virtual tours",
        message: error.message,
      },
      { status: 500 }
    );
  }
}
