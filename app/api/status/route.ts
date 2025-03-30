import { NextResponse } from 'next/server';
import { supabase } from '../../utility/supabase';

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  console.log('Fetching application with ID:', id);

  const { data: application, error } = await supabase
    .from('application')
    .select('id, status, comments(*)')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Supabase error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  console.log('Application data:', application);


  const response = {
    ...application
  };

  console.log('Final response:', response);
  return NextResponse.json(response);
}


export async function POST(request: Request) {
  try {
    const { applicationId, newStatus, comments } = await request.json();

    console.log('Received request:', { applicationId, newStatus, comments });

    // First verify the application exists
    const { data: exists, error: checkError } = await supabase
      .from('application')
      .select('*, miner_id')
      .eq('id', applicationId)
      .single();

    if (checkError || !exists) {
      console.error('Check error:', checkError);
      return NextResponse.json({ 
        error: `Application with ID ${applicationId} not found` 
      }, { status: 404 });
    }

    console.log('Application found:', exists);
    const minerId = exists.miner_id;

    // Update the application status
    const { data: updateData, error: updateError } = await supabase
      .from('application')
      .update({ 
        status: newStatus.toLowerCase() 
      })
      .match({ id: applicationId }) // Use match instead of eq
      .select('*');

    console.log('Update response:', { updateData, updateError });

    if (updateError) {
      console.error('Update error:', updateError);
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    if (!updateData || updateData.length === 0) {
      console.error('No rows updated');
      return NextResponse.json({ 
        error: 'No rows were updated. Please check the application ID and try again.' 
      }, { status: 400 });
    }

    // Add comment if provided
    if (comments) {
      const { error: commentError } = await supabase
        .from('comments')
        .insert([{ 
          application_id: applicationId, 
          miner_id: minerId,
          text: comments, 
          author: 'Admin',
          created_at: new Date().toISOString()
        }]);

      if (commentError) {
        console.error('Comment error:', commentError);
      }
    }

    // Verify the update
    const { data: verifyData, error: verifyError } = await supabase
      .from('application')
      .select('*')
      .eq('id', applicationId)
      .single();

    console.log('Verification data:', verifyData);

    if (verifyError || !verifyData) {
      console.error('Verification failed:', verifyError);
      return NextResponse.json({ 
        error: 'Failed to verify update' 
      }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      data: verifyData,
      message: 'Status updated successfully' 
    });

  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}