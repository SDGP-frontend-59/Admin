import { NextResponse } from 'next/server';
import { supabase } from '../../utility/supabase';

export async function GET() {
  const { data, error } = await supabase
    .from('application')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}