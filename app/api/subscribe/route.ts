
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { error } = await supabase
      .from('newsletter_subscriptions')
      .insert([{ email }]);

    if (error) {
      // Check for unique constraint violation
      if (error.code === '23505') {
        return NextResponse.json(
          { message: 'You are already subscribed!' },
          { status: 200 }
        );
      }
      // Check for table not found error
      if (error.code === '42P01') {
        return NextResponse.json(
          { error: 'Database setup incomplete. Please run the provided SQL script.' },
          { status: 500 }
        );
      }
      throw error;
    }

    return NextResponse.json(
      { message: 'Successfully subscribed!' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Subscription error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to subscribe. Please try again later.' },
      { status: 500 }
    );
  }
}
