// For API routes in the pages directory
import { createClient } from '@supabase/supabase-js';
import { NextApiRequest, NextApiResponse } from 'next';
import { parseCookies } from 'nookies';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

export function createServerSupabaseClient(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const cookies = parseCookies({ req });

	return createClient(supabaseUrl, supabaseAnonKey, {
		global: {
			headers: {
				cookie: req.headers.cookie || '',
			},
		},
	});
}
