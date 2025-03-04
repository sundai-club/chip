import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: Request) {
	try {
		// Get the authorization header
		const authHeader = request.headers.get('authorization');

		if (!authHeader || !authHeader.startsWith('Bearer ')) {
			return NextResponse.json({
				authenticated: false,
				reason: 'No token provided',
			});
		}

		const token = authHeader.split(' ')[1];

		// Create a new Supabase client
		const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
		const supabaseAnonKey = process.env
			.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
		const supabase = createClient(supabaseUrl, supabaseAnonKey);

		// Verify the token
		const { data, error } = await supabase.auth.getUser(token);

		if (error || !data.user) {
			return NextResponse.json({
				authenticated: false,
				reason: error?.message || 'Invalid token',
			});
		}

		return NextResponse.json({
			authenticated: true,
			user: {
				id: data.user.id,
				email: data.user.email,
			},
		});
	} catch (error) {
		console.error('Auth test direct error:', error);
		return NextResponse.json(
			{
				authenticated: false,
				error: 'Internal server error',
			},
			{ status: 500 }
		);
	}
}
