import { NextResponse } from 'next/server';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

// Create a new pledge
export async function POST(request: Request) {
	try {
		// Create a server-side Supabase client with cookies
		const supabase = createServerComponentClient({ cookies });

		// Log all cookies for debugging
		const cookieStore = cookies();
		console.log(
			'Available cookies in pledges API:',
			cookieStore.getAll().map((c) => c.name)
		);

		// Check if user is authenticated with detailed logging
		const { data, error: sessionError } = await supabase.auth.getSession();

		// Also check for the custom header from middleware
		const userId = request.headers.get('x-user-id');

		console.log('Session check in pledges API:', {
			hasSession: !!data.session,
			sessionError: sessionError?.message,
			userId: data.session?.user?.id,
			headerUserId: userId,
		});

		// Use either the session or the header
		const authenticatedUserId = data.session?.user?.id || userId;

		if (!authenticatedUserId) {
			return NextResponse.json(
				{ error: 'Unauthorized - No valid session found' },
				{ status: 401 }
			);
		}

		// Get request body
		const body = await request.json();
		const { taskId, amount } = body;

		if (
			!taskId ||
			!amount ||
			isNaN(parseFloat(amount)) ||
			parseFloat(amount) <= 0
		) {
			return NextResponse.json(
				{ error: 'Invalid pledge data' },
				{ status: 400 }
			);
		}

		// Check if user already has a pledge for this task
		const { data: existingPledge } = await supabase
			.from('pledges')
			.select('*')
			.eq('task_id', taskId)
			.eq('user_id', authenticatedUserId)
			.single();

		if (existingPledge) {
			// Update existing pledge
			const { data, error } = await supabase
				.from('pledges')
				.update({
					amount: parseFloat(amount),
					updated_at: new Date().toISOString(),
				})
				.eq('id', existingPledge.id)
				.select();

			if (error) throw error;

			// Update task statistics
			await updateTaskStats(taskId);

			return NextResponse.json(data[0]);
		} else {
			// Create new pledge
			const { data: pledgeData, error } = await supabase
				.from('pledges')
				.insert({
					task_id: taskId,
					user_id: authenticatedUserId,
					amount: parseFloat(amount),
				})
				.select();

			if (error) throw error;

			// Update task statistics
			await updateTaskStats(taskId);

			return NextResponse.json(pledgeData[0]);
		}
	} catch (error: any) {
		console.error('Error creating/updating pledge:', error);
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}

// Get all pledges for a task
export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const taskId = searchParams.get('taskId');
	const limit = searchParams.get('limit')
		? parseInt(searchParams.get('limit')!)
		: undefined;
	const sortBy = searchParams.get('sortBy') || 'amount';
	const sortOrder = searchParams.get('sortOrder') || 'desc';

	if (!taskId) {
		return NextResponse.json(
			{ error: 'Task ID is required' },
			{ status: 400 }
		);
	}

	try {
		// Create a server-side Supabase client with cookies
		const supabase = createServerComponentClient({ cookies });

		console.log(
			`Fetching pledges for task: ${taskId}, user requesting: ${request.headers.get(
				'x-user-id'
			)}`
		);

		let query = supabase
			.from('pledges')
			.select('id, amount, created_at, user_id')
			.eq('task_id', taskId);

		// Add sorting
		if (sortBy === 'amount') {
			query = query.order('amount', { ascending: sortOrder === 'asc' });
		} else if (sortBy === 'date') {
			query = query.order('created_at', {
				ascending: sortOrder === 'asc',
			});
		}

		// Add limit if specified
		if (limit) {
			query = query.limit(limit);
		}

		const { data: pledges, error } = await query;

		if (error) {
			console.error('Error fetching pledges:', error);
			console.error('Error details:', JSON.stringify(error, null, 2));
			return NextResponse.json({ error: error.message }, { status: 500 });
		}

		console.log(
			`Found ${pledges.length} pledges for task ${taskId}:`,
			pledges.map((p) => ({
				id: p.id,
				userId: p.user_id,
				amount: p.amount,
			}))
		);

		// Now fetch user profiles separately
		const userIds = pledges.map((pledge) => pledge.user_id);

		if (userIds.length === 0) {
			return NextResponse.json([]);
		}

		const { data: profiles, error: profilesError } = await supabase
			.from('profiles')
			.select('id, username, avatar_url')
			.in('id', userIds);

		if (profilesError) {
			console.error('Error fetching profiles:', profilesError);
			// Continue anyway, we'll use fallback values
		}

		// Combine the data
		const result = pledges.map((pledge) => {
			const profile =
				profiles?.find((p) => p.id === pledge.user_id) || null;
			return {
				...pledge,
				profiles: profile
					? {
							username: profile.username || 'Anonymous',
							avatar_url: profile.avatar_url,
					  }
					: {
							username: 'Anonymous',
							avatar_url: null,
					  },
			};
		});

		return NextResponse.json(result);
	} catch (error: any) {
		console.error('Error in GET pledges:', error);
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}

// Helper function to update task statistics
async function updateTaskStats(taskId: string) {
	// Create a server-side Supabase client with cookies
	const supabase = createServerComponentClient({ cookies });

	const { error: updateError } = await supabase
		.from('tasks')
		.update({
			pledge_amount: supabase.rpc('calculate_total_pledges', {
				task_id: taskId,
			}),
			contributors: supabase.rpc('count_unique_contributors', {
				task_id: taskId,
			}),
		})
		.eq('id', taskId);

	if (updateError) {
		console.error('Error updating task with new pledge data:', updateError);
	}
}

// Helper functions
async function calculateTotalPledges(taskId: string) {
	const { data, error } = await supabase
		.from('pledges')
		.select('amount')
		.eq('task_id', taskId);

	if (error || !data) return 0;
	return data.reduce(
		(sum: number, pledge: { amount: number }) => sum + pledge.amount,
		0
	);
}

async function countContributors(taskId: string) {
	const { count, error } = await supabase
		.from('pledges')
		.select('user_id', { count: 'exact', head: true })
		.eq('task_id', taskId);

	return count || 0;
}
