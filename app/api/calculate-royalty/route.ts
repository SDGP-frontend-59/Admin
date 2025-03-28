import { NextResponse } from 'next/server';
import { supabase } from '../../utility/supabase';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Validate that miner_id is provided
    if (!data.miner_id) {
      return NextResponse.json({ error: 'Miner ID is required' }, { status: 400 });
    }

    // Insert into royalty table with all fields
    const { data: insertedData, error } = await supabase
      .from('royalty')
      .insert({
        miner_id: data.miner_id,
        water_gel: data.water_gel,
        nh4no3: data.nh4no3,
        powder_factor: data.powder_factor,
        total_explosive_quantity: data.total_explosive_quantity,
        blasted_rock_volume: data.blasted_rock_volume,
        base_royalty: data.base_royalty,
        royalty_with_sscl: data.royalty_with_sscl,
        total_amount: data.total_amount,
        calculation_date: data.calculation_date,
        payment_due_date: data.payment_due_date
      })
      .select();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Royalty calculation saved successfully',
      data: insertedData
    });
  } catch (error) {
    console.error('Error saving royalty:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Failed to save royalty calculation' 
    }, { status: 500 });
  }
}


export async function GET(request: Request) {
  try {
    // Get miners with role = 'miner'
    const { data: miners, error } = await supabase
      .from('users')
      .select('id, first_name, last_name')
      .eq('role', 'miner');

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(miners);
  } catch (error) {
    console.error('Error fetching miners:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Failed to fetch miners' 
    }, { status: 500 });
  }
}