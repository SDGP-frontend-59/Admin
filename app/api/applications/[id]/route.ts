import { NextResponse } from 'next/server';
import { supabase } from '../../../utility/supabase';

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  console.log('Fetching application with ID:', id);

  const { data: application, error } = await supabase
    .from('application')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Supabase error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  console.log('Application data:', application);

  // Fetch related documents
  const { data: documents, error: docError } = await supabase
    .from('documents')
    .select('*')
    .eq('application_id', id);

  if (docError) {
    console.error('Documents error:', docError);
  }

  // Fetch related comments
  const { data: comments, error: commentError } = await supabase
    .from('comments')
    .select('*')
    .eq('application_id', id)
    .order('created_at', { ascending: false });

  if (commentError) {
    console.error('Comments error:', commentError);
  }

  const response = {
    ...application,
    documents: documents || [],
    comments: comments || []
  };

  console.log('Final response:', response);
  return NextResponse.json(response);
}