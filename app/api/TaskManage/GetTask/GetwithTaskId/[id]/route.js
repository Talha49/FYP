// /app/api/GetTaskById/[taskId]/route.js

import dbConnect from '@/lib/connectdb/connection';
import FieldNoteDB from '@/lib/models/FieldNoteDB';
import { NextResponse } from 'next/server';
export async function GET(req, { params }) {
    await dbConnect();

    const { id } = params;
    try {
        const fieldnote = await FieldNoteDB.findById(id);

        if (!fieldnote) {
            return NextResponse.json({ success: false, error: "Task not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: fieldnote }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, error: "An Error While Getting FieldNote" }, { status: 500 });
    }
}