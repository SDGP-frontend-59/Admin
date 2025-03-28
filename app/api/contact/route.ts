import { NextResponse } from 'next/server';
import { supabase } from '../../utility/supabase';

// Get all complaints
export async function GET() {
  console.log('Fetching contacts from Supabase...');
  
  // Add more detailed logging
  const { data, error } = await supabase
    .from('contact_data')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Supabase error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  console.log('Contacts fetched:', data);
  return NextResponse.json(data);
}