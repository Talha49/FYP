import dbConnect from '@/lib/connectdb/connection';
import { NextResponse } from 'next/server';
import FieldNoteDB from '../../../../lib/models/FieldNoteDB'

export async function GET(req) {
    await dbConnect();
   
    try {
        const fieldnotes = await FieldNoteDB.find(); // This will return all fields
        return NextResponse.json({ success: true, data: fieldnotes }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, error: "An Error While Getting FieldNotes" }, { status: 500 });
    }
}
