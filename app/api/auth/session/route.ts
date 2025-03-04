import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
	try {
		const { refresh_token } = await request.json();
		const authHeader = request.headers.get('authorization');

		if (!authHeader || !authHeader.startsWith('Bearer ')) {
			return NextResponse.json(
				{ error: 'Invalid authorization header' },
				{ status: 401 }
			);
		}

		const access_token = authHeader.split(' ')[1];

		if (!access_token || !refresh_token) {
			return NextResponse.json(
				{ error: 'Missing tokens' },
				{ status: 400 }
			);
		}

		// Create a Supabase client
		const supabase = createRouteHandlerClient({ cookies });

		// Set the session manually
		const { data, error } = await supabase.auth.setSession({
			access_token,
			refresh_token,
		});

		if (error) {
			console.error('Error setting session:', error);
			return NextResponse.json({ error: error.message }, { status: 500 });
		}

		// Set cookies manually as well
		const cookieStore = cookies();
		cookieStore.set('sb-access-token', access_token, {
			path: '/',
			maxAge: 3600 * 8, // 8 hours
			sameSite: 'lax',
		});
		cookieStore.set('sb-refresh-token', refresh_token, {
			path: '/',
			maxAge: 3600 * 24 * 7, // 7 days
			sameSite: 'lax',
		});

		return NextResponse.json({ success: true, user: data.user });
	} catch (error) {
		console.error('Error in session route:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}
