import dbConnect from "@/lib/connectdb/connection";
import New from "@/lib/models/New";
import { NextResponse } from "next/server";

export async function GET(reg, { params }) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { message: "Missing infospot ID" },
        { status: 400 }
      );
    }
    await dbConnect();
    const rfis = await New.find({ vt_id: id });
    return NextResponse.json(
      { message: "RFIs fetched successfully", rfis },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: error.message,
      },
      { status: 500 }
    );
  }
}
