import { NextResponse } from 'next/server';
import { supabase } from '../../utility/supabase';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const name = formData.get('name') as string;
    const latitude = parseFloat(formData.get('latitude') as string);
    const longitude = parseFloat(formData.get('longitude') as string);
    const description = formData.get('description') as string;
    const longDes = formData.get('longDes') as string;
    const image_name = formData.get('image') as File;

    let image = '';

    if (image_name) {
      try {
        // Convert File to ArrayBuffer
        const arrayBuffer = await image_name.arrayBuffer();
        const buffer = new Uint8Array(arrayBuffer);

        const fileExt = image_name.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

        console.log('Attempting to upload file:', {
          fileName,
          fileSize: image_name.size,
          fileType: image_name.type
        });

        // First check if the bucket exists
        const { data: buckets, error: bucketError } = await supabase
          .storage
          .listBuckets();
          
        console.log('Available buckets:', buckets?.map(b => b.name));
        
        if (bucketError) {
          console.error('Bucket listing error:', bucketError);
        }

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('map-locations')
          .upload(fileName, buffer, {
            contentType: image_name.type,
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) {
          console.error('Upload error details:', uploadError);
          throw new Error(`Failed to upload image: ${uploadError.message}`);
        }

        console.log('File uploaded successfully:', uploadData);

        const { data: { publicUrl } } = supabase.storage
          .from('map-locations')
          .getPublicUrl(fileName);

        image = publicUrl;
        console.log('Generated public URL:', image);
      } catch (uploadError) {
        console.error('Image upload failed:', uploadError);
        // Continue with location creation even if image upload fails
        // Just don't include an image URL
      }
    }

    console.log('Inserting into database with data:', {
      name,
      latitude,
      longitude,
      description,
      image,
      longDes
    });

    const { data, error } = await supabase
      .from('locations')
      .insert([
        {
          name,
          latitude,
          longitude,
          description,
          image,
          longDes,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('locations')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}