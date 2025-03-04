import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
	try {
		const requestData = await request.json();
		const { session } = requestData;

		if (!session) {
			return NextResponse.json(
				{ error: 'No session provided' },
				{ status: 400 }
			);
		}

		// Create a Supabase client
		const supabase = createRouteHandlerClient({ cookies });

		// Set the session manually
		const { error } = await supabase.auth.setSession(session);

		if (error) {
			console.error('Error setting session:', error);
			return NextResponse.json({ error: error.message }, { status: 500 });
		}

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error('Error in set-session route:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}
