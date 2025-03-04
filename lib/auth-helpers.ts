import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

// For server components
export function createServerClient() {
	const cookieStore = cookies();

	return createClient(supabaseUrl, supabaseAnonKey, {
		auth: {
			persistSession: true,
			autoRefreshToken: true,
			detectSessionInUrl: false,
			flowType: 'pkce',
			storage: {
				getItem: (key) => {
					const cookie = cookieStore.get(key);
					return cookie?.value;
				},
				setItem: (key, value) => {
					// This won't work in Next.js server components/API routes
					// We're just implementing the interface
				},
				removeItem: (key) => {
					// This won't work in Next.js server components/API routes
					// We're just implementing the interface
				},
			},
		},
	});
}
