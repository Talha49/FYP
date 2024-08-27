import dbConnect from '@/lib/connectdb/connection';
import { NextResponse } from 'next/server';
import FieldNoteDB from '../../../../lib/models/FieldNoteDB'

export async function POST(req) {
    await dbConnect();
  
    try {
      const body = await req.json();
      const {
        user,
        name,
        room,
        floor,
        priority,
        imageUrls,
        tags,
        description,
        assignee,
        dueDate,
        watchers,
      } = body;
  
      
      if (!user || !name || !room || !floor || !priority || !imageUrls || !tags || !description || !assignee || !dueDate || !watchers) {
        return NextResponse.json({ success: false, error: 'All fields are required' }, { status: 400 });
      }
  
      
      if (!Array.isArray(tags) || tags.length === 0) {
        return NextResponse.json({ success: false, error: 'At least one tag is required' }, { status: 400 });
      }
  
      
      const fieldNote = await FieldNoteDB.create(body);
      return NextResponse.json({ success: true, data: fieldNote }, { status: 201 });
    } catch (error) {
      if (error.name === 'ValidationError') {
        const errors = Object.values(error.errors).map(err => err.message);
        return NextResponse.json({ success: false, error: errors }, { status: 400 });
      }
      return NextResponse.json({ success: false, error: 'An unexpected error occurred' }, { status: 500 });
    }
  }