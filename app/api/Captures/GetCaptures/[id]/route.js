import dbConnect from "@/lib/connectdb/connection";
import Capture from "@/lib/models/Capture";
import { NextResponse } from "next/server";


export async function GET(req, {params}){
   
    try {
        await dbConnect()
        const {id} = params;
        const captures = await Capture.find({user:id});
        return NextResponse.json({success:true, data:captures, }, {status:200}  )

    } catch (error) {
        return NextResponse.json({ success: false, error: "An Error While Getting FieldNotes" }, { status: 500 });
    } 
}