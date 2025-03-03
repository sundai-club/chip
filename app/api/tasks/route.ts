import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';

export async function GET() {
	const supabase = createServerSupabaseClient();
	const { data: tasks, error } = await supabase
		.from('tasks')
		.select('*, profiles(username, avatar_url)');

	if (error) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}

	const formattedTasks = tasks.map((task) => ({
		id: task.id,
		title: task.title,
		description: task.description,
		dueDate: task.due_date,
		pledgeAmount: task.pledge_amount,
		goalAmount: task.goal_amount,
		status: task.status,
		contributors: task.contributors,
		category: task.category,
		imageUrl: task.image_url,
		createdBy: task.profiles?.username || 'Unknown',
		privacy: task.privacy,
	}));

	return NextResponse.json(formattedTasks);
}

export async function POST(request: Request) {
	const supabase = createServerSupabaseClient();
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
