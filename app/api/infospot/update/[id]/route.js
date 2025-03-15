import dbConnect from "@/lib/connectdb/connection";
import Infospot from "@/lib/models/Infospot";
import { NextResponse } from "next/server";

export async function PUT(req, { params }) {
  try {
    const { id } = params; // No need to await params
    const { title, description } = await req.json();

    if (!id) {
      return NextResponse.json(
        { message: "Infospot ID is required" },
        { status: 400 }
      );
    }

    if (!title || !description) {
      return NextResponse.json(
        { message: "Title and description are required" },
        { status: 400 }
      );
    }

    await dbConnect();

    const updatedInfospot = await Infospot.findByIdAndUpdate(
      id,
      { title, description },
      { new: true }
    );

    if (!updatedInfospot) {
      return NextResponse.json(
        { message: "Infospot not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "Infospot updated successfully",
        updatedInfospot,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to update infospot", error: error.message },
      { status: 500 }
    );
  }
}
