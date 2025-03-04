import { NextResponse } from 'next/server';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET() {
	try {
		// Create a server-side Supabase client with cookies
		const supabase = createServerComponentClient({ cookies });

		// First, get all tasks
		const { data: tasks, error: tasksError } = await supabase
			.from('tasks')
			.select('*, profiles(username, avatar_url)');

		if (tasksError) {
			console.error('Error fetching tasks:', tasksError);
			return NextResponse.json(
				{ error: tasksError.message },
				{ status: 500 }
			);
		}

		// For each task, get the pledge data
		const tasksWithPledgeData = await Promise.all(
			tasks.map(async (task) => {
				// Get sum of pledges for this task
				const { data: pledgeSum, error: pledgeSumError } =
					await supabase
						.from('pledges')
						.select('amount')
						.eq('task_id', task.id);

				if (pledgeSumError) {
					console.error(
						`Error fetching pledges for task ${task.id}:`,
						pledgeSumError
					);
					return {
						id: task.id,
						title: task.title,
						description: task.description,
						dueDate: task.due_date,
						pledgeAmount: 0,
						goalAmount: task.goal_amount,
						status: task.status || 'New',
						contributors: 0,
						category: task.category,
						imageUrl: task.image_url,
						createdBy: task.profiles?.username || 'Unknown',
						privacy: task.privacy,
					};
				}

				// Calculate total pledge amount
				const totalPledged = pledgeSum.reduce(
					(sum, pledge) => sum + (parseFloat(pledge.amount) || 0),
					0
				);

				// Count unique contributors
				const { data: uniqueContributors, error: contributorsError } =
					await supabase
						.from('pledges')
						.select('user_id')
						.eq('task_id', task.id);

				if (contributorsError) {
					console.error(
						`Error fetching contributors for task ${task.id}:`,
						contributorsError
					);
					return {
						id: task.id,
						title: task.title,
						description: task.description,
						dueDate: task.due_date,
						pledgeAmount: totalPledged,
						goalAmount: task.goal_amount,
						status: task.status || 'New',
						contributors: 0,
						category: task.category,
						imageUrl: task.image_url,
						createdBy: task.profiles?.username || 'Unknown',
						privacy: task.privacy,
					};
				}

				// Get unique contributor count
				const uniqueContributorCount = new Set(
					uniqueContributors.map((p) => p.user_id)
				).size;

				// Return task with updated pledge data
				return {
					id: task.id,
					title: task.title,
					description: task.description,
					dueDate: task.due_date,
					pledgeAmount: totalPledged,
					goalAmount: task.goal_amount,
					status: task.status || 'New',
					contributors: uniqueContributorCount,
					category: task.category,
					imageUrl: task.image_url,
					createdBy: task.profiles?.username || 'Unknown',
					privacy: task.privacy,
				};
			})
		);

		console.log(
			'Raw tasks from database:',
			tasks.map((t) => ({
				id: t.id,
				title: t.title,
				status: t.status,
			}))
		);

		console.log(
			'Processed tasks:',
			tasksWithPledgeData.map((t) => ({
				id: t.id,
				title: t.title,
				status: t.status,
				pledgeAmount: t.pledgeAmount,
				hasUserPledged: 'Not checked at API level',
			}))
		);

		return NextResponse.json(tasksWithPledgeData);
	} catch (error) {
		console.error('Unexpected error fetching tasks:', error);
		return NextResponse.json(
			{ error: 'An unexpected error occurred' },
			{ status: 500 }
		);
	}
}

export async function POST(request: Request) {
	const supabase = createServerComponentClient({ cookies });
	const {
		data: { session },
	} = await supabase.auth.getSession();

	if (!session) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	}

	const body = await request.json();
	const {
		title,
		description,
		dueDate,
		goalAmount,
		category,
		imageUrl,
		privacy,
	} = body;

	const { data, error } = await supabase
		.from('tasks')
		.insert({
			title,
			description,
			due_date: dueDate,
			goal_amount: goalAmount,
			category,
			image_url: imageUrl,
			created_by: session.user.id,
			privacy,
		})
		.select();

	if (error) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}

	return NextResponse.json(data[0]);
}
