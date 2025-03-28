import { NextResponse } from 'next/server';
import { supabase } from '../../utility/supabase';

// Get all complaints
export async function GET() {
  console.log('Fetching complaints from Supabase...');
  
  // Add more detailed logging
  const { data, error } = await supabase
    .from('complaints')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Supabase error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  console.log('Complaints fetched:', data);
  return NextResponse.json(data);
}

// Update complaint status
export async function PUT(request: Request) {
  try {
    const { id, status } = await request.json();

    const { data, error } = await supabase
      .from('complaints')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update complaint' },
      { status: 500 }
    );
  }
}

// Delete complaint
export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();

    const { error } = await supabase
      .from('complaints')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete complaint' },
      { status: 500 }
    );
  }
}
