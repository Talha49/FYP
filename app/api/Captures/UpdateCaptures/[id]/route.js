import Capture from "@/lib/models/Capture";
import { NextResponse } from "next/server";


export async function PUT(req,{params}) {

    try {

        const {id} = params    
const body = await req.json();

const { floor, captureType, captureName, imageUrl} = body;

const existingcaptures = await Capture.findById(id);
if(!existingcaptures){
    return NextResponse.json(
        { success: false, error: "Field note not found" },
        { status: 404 }
    )
}


const updatecaptures = await Capture.findByIdAndUpdate(id, {
    floor, captureType, captureName, imageUrl
},
{ new: true, runValidators: true }

)

return NextResponse.json(
    { success: true, data: updatecaptures },
    { status: 200 }
  );
        
    } catch (error) {
        return NextResponse.json({error: 'Failed to fetch captures'}, {status:500}   )
    }

 
}
