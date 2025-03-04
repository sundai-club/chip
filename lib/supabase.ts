// This file is for App Router usage
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

// For client components
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// For server components and API routes in the app directory
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export function createServerSupabaseClient() {
	return createServerComponentClient({ cookies });
}
