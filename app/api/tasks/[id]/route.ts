import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase-client';

export async function GET(
	request: Request,
	{ params }: { params: { id: string } }
) {
	try {
		const id = params.id;

		// Get the task
		const { data: task, error: taskError } = await supabase
			.from('tasks')
			.select('*')
			.eq('id', id)
			.single();

		if (taskError) {
			console.error(`Error fetching task ${id}:`, taskError);
			return NextResponse.json(
				{ error: taskError.message },
				{ status: 404 }
			);
		}

		// Get sum of pledges for this task
		const { data: pledges, error: pledgesError } = await supabase
			.from('pledges')
			.select('amount, user_id')
			.eq('task_id', id);

		if (pledgesError) {
			console.error(
				`Error fetching pledges for task ${id}:`,
				pledgesError
			);
			return NextResponse.json({
				...task,
				pledgeAmount: 0,
				contributors: 0,
			});
		}

		// Calculate total pledge amount
		const totalPledged = pledges.reduce(
			(sum, pledge) => sum + (parseFloat(pledge.amount) || 0),
			0
		);

		// Count unique contributors
		const uniqueContributorCount = new Set(pledges.map((p) => p.user_id))
			.size;

		// Return task with updated pledge data
		return NextResponse.json({
			...task,
			pledgeAmount: totalPledged,
			contributors: uniqueContributorCount,
		});
	} catch (error) {
		console.error('Unexpected error fetching task:', error);
		return NextResponse.json(
			{ error: 'An unexpected error occurred' },
			{ status: 500 }
		);
	}
}
