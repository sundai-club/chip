import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';

export async function GET() {
	const supabase = createServerSupabaseClient();

	try {
		// Get table structure
		const { data: tableInfo, error: tableError } = await supabase.rpc(
			'get_table_definition',
			{ table_name: 'profiles' }
		);

		if (tableError) {
			console.error('Error getting table definition:', tableError);
		}

		// Get sample data (first 5 records)
		const { data: sampleData, error: dataError } = await supabase
			.from('profiles')
			.select('*')
			.limit(5);

		if (dataError) {
			console.error('Error fetching sample data:', dataError);
		}

		// Count total records
		const { count, error: countError } = await supabase
			.from('profiles')
			.select('*', { count: 'exact', head: true });

		if (countError) {
			console.error('Error counting records:', countError);
		}

		return NextResponse.json({
			tableInfo: tableInfo || 'Unable to fetch table definition',
			sampleData: sampleData || [],
			totalRecords: count || 0,
		});
	} catch (error) {
		console.error('Debug API error:', error);
		return NextResponse.json(
			{ error: 'Failed to fetch debug information' },
			{ status: 500 }
		);
	}
}
