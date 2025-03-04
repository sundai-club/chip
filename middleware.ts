import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
	const res = NextResponse.next();

	// Create a Supabase client specifically for the middleware
	const supabase = createMiddlewareClient({ req, res });

	try {
		// This refreshes the session and sets the auth cookie
		const { data, error } = await supabase.auth.getSession();

		if (error) {
			console.error('Middleware session error:', error.message);
		}

		console.log('Middleware session check:', {
			hasSession: !!data.session,
			url: req.nextUrl.pathname,
			cookies: req.cookies.getAll().map((c) => c.name),
		});

		// If we have a session, set a custom header that our API routes can use
		if (data.session) {
			res.headers.set('x-user-id', data.session.user.id);
		}
	} catch (e) {
		console.error('Middleware error:', e);
	}

	return res;
}

export const config = {
	matcher: [
		// Apply this middleware to all routes except static files
		'/((?!_next/static|_next/image|favicon.ico).*)',
	],
};
