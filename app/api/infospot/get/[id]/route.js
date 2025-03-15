import dbConnect from "@/lib/connectdb/connection";
import Infospot from "@/lib/models/Infospot";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { message: "Infospot id is required" },
        { status: 400 }
      );
    }
    await dbConnect();
    const infospots = await Infospot.find({ vt_id: id });
    return NextResponse.json(
      { message: "Infospots fetched successfully", infospots },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch infospots", error: error.message },
      { status: 500 }
    );
  }
}
