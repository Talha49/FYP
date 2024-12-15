import { NextResponse } from 'next/server';
import dbConnect from '@/lib/connectdb/connection'; // Ensure this is the correct path
import NewTask from '../../../../lib/models/New'; // Ensure this path is correct

export async function GET(req) {
    try {
        // Log the request to check the structure of 'req'
       
        // Connect to the database
        await dbConnect(); // This ensures the database connection is established

        // Accessing the query parameter from the URL using 'nextUrl'
        const { searchParams } = req.nextUrl; // Using 'searchParams' to extract query params
        const id = searchParams.get('id'); // Get the 'id' query parameter

        // Log the received ID to debug
        console.log("Received userId:", id);

        if (!id) {
            return NextResponse.json({ success: false, error: 'User ID is required' }, { status: 400 });
        }

        // Fetch tasks where the assignee's id matches the provided user ID
        const tasks = await NewTask.find({
            'assignees.id': id  // Match the 'id' field inside the 'assignees' array of objects
        });

        // Log the fetched tasks data to debug
        console.log("Fetched tasks:", tasks);

        return NextResponse.json({ success: true, data: tasks }, { status: 200 });
    } catch (error) {
        console.error("Error in GET /api/New/getAssignedTasks:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
