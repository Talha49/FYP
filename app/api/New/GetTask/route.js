import { NextResponse } from 'next/server'; // Import NextResponse

import NewTask  from '../../../../lib/models/New'
import dbConnect from '@/lib/connectdb/connection';
export async function GET() {
  try {
    await dbConnect(); 

   
    const tasks = await NewTask.find({}); 

   
    return NextResponse.json({ success: true, data: tasks }, { status: 200 });
  } catch (error) {
    console.error("Error retrieving tasks:", error);

    
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
