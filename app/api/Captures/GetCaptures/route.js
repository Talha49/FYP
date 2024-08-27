import dbConnect from "@/lib/connectdb/connection";
import Capture from "@/lib/models/Capture";
import { NextResponse } from "next/server";


export async function GET(){
    try {
        await dbConnect();
        const captures = await Capture.find({})
        return NextResponse.json(captures, {status:200})
    } catch (error) {
        return NextResponse.json({error: 'Failed to fetch captures'}, {status:500}   )
    }
}