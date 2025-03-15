import dbConnect from "@/lib/connectdb/connection";
import Infospot from "@/lib/models/Infospot";
import { NextResponse } from "next/server";

export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        {
          message: "Infospot id is required",
        },
        {
          status: 400,
        }
      );
    }
    await dbConnect();
    const deletedInfospot = await Infospot.findByIdAndDelete(id);
    if (!deletedInfospot) {
      return NextResponse.json(
        {
          message: "Infospot not found",
        },
        {
          status: 404,
        }
      );
    }
    return NextResponse.json({
      message: "Infospot deleted successfully",
      deletedInfospot,
    });
  } catch (error) {
    return NextResponse.json({
      message: "Failed to delete infospot.",
      error: error.message,
    });
  }
}
