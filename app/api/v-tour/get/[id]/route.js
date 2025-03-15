import dbConnect from "@/lib/connectdb/connection";
import Infospot from "@/lib/models/Infospot";
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
    // Fetch infospots for each virtual tour
    const virtualToursWithInfospots = await Promise.all(
      virtualTours.map(async (vt) => {
        const infospots = await Infospot.find({ vt_id: vt._id });
        return { ...vt.toObject(), infospots }; // Convert Mongoose document to object
      })
    );
    return NextResponse.json(
      {
        message: "Virtual tours fetched successfully",
        virtualTours: virtualToursWithInfospots,
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
