import dbConnect from "@/lib/connectdb/connection";
import Inspection from "@/lib/models/Inspection";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { title, description } = await req.json();
    if (!title || !description) {
      return NextResponse.json({
        message: "Title and description are required.",
      });
    }
    await dbConnect();
    const newInspection = new Inspection({
      title,
      description,
    });
    await newInspection.save();
    return NextResponse.json({
      message: "Inspection created successfully.",
      newInspection,
    });
  } catch (error) {
    return NextResponse.json({
      message: "Error creating inspection.",
      error: error.message,
    });
  }
}
