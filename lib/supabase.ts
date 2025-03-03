// This file is for App Router usage
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

// For client components
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// For server components and API routes in the app directory
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export function createServerSupabaseClient() {
	const cookieStore = cookies();

	return createServerClient(supabaseUrl, supabaseAnonKey, {
		cookies: {
			get(name: string) {
				return cookieStore.get(name)?.value;
			},
			set(name: string, value: string, options: any) {
				cookieStore.set({ name, value, ...options });
			},
			remove(name: string, options: any) {
				cookieStore.set({ name, value: '', ...options });
			},
		},
	});
}
