import { NextResponse } from 'next/server';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET() {
	try {
		const supabase = createServerComponentClient({ cookies });

		// Log all cookies
		const cookieStore = cookies();
		console.log(
			'Auth check cookies:',
			cookieStore.getAll().map((c) => c.name)
		);

		const { data } = await supabase.auth.getSession();

		if (data.session) {
			return NextResponse.json({
				authenticated: true,
				userId: data.session.user.id,
				email: data.session.user.email,
			});
		} else {
			return NextResponse.json({
				authenticated: false,
				message: 'No session found',
			});
		}
	} catch (error) {
		console.error('Auth check error:', error);
		return NextResponse.json(
			{
				authenticated: false,
				error: error.message,
			},
			{ status: 500 }
		);
	}
}
