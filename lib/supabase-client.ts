// This file is for client-side and Pages Router usage
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

// For client components and pages directory
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
