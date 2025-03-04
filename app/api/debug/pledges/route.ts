import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';

export async function GET() {
	const supabase = createServerSupabaseClient();

	try {
		// Get sample data (first 5 records)
		const { data: sampleData, error: dataError } = await supabase
			.from('pledges')
			.select('*')
			.limit(5);

		if (dataError) {
			console.error('Error fetching sample data:', dataError);
			return NextResponse.json(
				{ error: dataError.message },
				{ status: 500 }
			);
		}

		// Count total records
		const { count, error: countError } = await supabase
			.from('pledges')
			.select('*', { count: 'exact', head: true });

		if (countError) {
			console.error('Error counting records:', countError);
		}

		return NextResponse.json({
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
