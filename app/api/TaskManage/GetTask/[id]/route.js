import dbConnect from '@/lib/connectdb/connection';
import FieldNoteDB from '@/lib/models/FieldNoteDB';
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
    await dbConnect();

    const { id } = params; // This is the user ID
    try {
        // Find tasks where the 'user' field matches the provided user ID
        const fieldnotes = await FieldNoteDB.find({ user: id });

        return NextResponse.json({ success: true, data: fieldnotes }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, error: "An Error While Getting FieldNotes" }, { status: 500 });
    }
}


