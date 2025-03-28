import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../utility/supabase';

export async function PUT(
  request: NextRequest,
  context: any
) {
  try {
    const userId = context.params?.id;
    
    if (!userId) {
      console.error('Missing userId in params:', context.params);
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }
    
    const body = await request.json();
    
    // Validate the body contains allowed fields
    const allowedFields = ['role', 'license_status', 'active_date'];
    const updateData: Record<string, any> = {};
    
    for (const field of allowedFields) {
      if (field in body) {
        updateData[field] = body[field];
      }
    }
    
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: 'No valid fields to update' },
        { status: 400 }
      );
    }
    
    console.log('Updating user with ID:', userId);
    console.log('Update data:', updateData);
    
    // Update the user in the database
    const { data, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', userId)
      .select();
      
    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    if (!data || data.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    return NextResponse.json(data[0]);
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/*import { NextResponse } from 'next/server';
import { supabase } from '../../../utility/supabase';

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const { role, license_status } = body;

    // First check if user exists
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('id')
      .eq('id', id)
      .single();

    if (checkError || !existingUser) {
      console.error('User not found:', checkError);
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Update both role and license_status in a single query
    const updateData: any = {};
    if (role) updateData.role = role;
    if (license_status) updateData.license_status = license_status;

    const { data, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Update error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);

  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} */
