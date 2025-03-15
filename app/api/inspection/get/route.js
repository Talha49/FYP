import dbConnect from "@/lib/connectdb/connection";
import Inspection from "@/lib/models/Inspection";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await dbConnect();
    const inspections = await Inspection.find().lean();
    if (inspections.length === 0) {
      return NextResponse.json({
        message: "No Inspections found",
      });
    }
    return NextResponse.json({
      message: "Inspections fetched successfully",
      inspections,
    });
  } catch (error) {
    return NextResponse.json({
      message: "failed to fetch inspections",
      error: error.message,
    });
  }
}
