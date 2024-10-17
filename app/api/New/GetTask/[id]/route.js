import { NextResponse } from 'next/server';
import dbConnect from '@/lib/connectdb/connection';
import NewTask from '../../../../../lib/models/New'


export async function GET(req, { params }) {
    try {
        await dbConnect();

        const userId = params.id; 

        if (!userId) {
            return NextResponse.json({ success: false, error: 'userId is required' }, { status: 400 });
        }

        const tasks = await NewTask.find({ userId: userId });

        return NextResponse.json({ success: true, data: tasks }, { status: 200 });
    } catch (error) {
        console.error("Error in GET /api/New/GetTask/[id]:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}