import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';

export async function GET(
	request: Request,
	{ params }: { params: { id: string } }
) {
	const id = params.id;
	const supabase = createServerSupabaseClient();

	const { data: task, error } = await supabase
		.from('tasks')
		.select('*, profiles(username, avatar_url)')
		.eq('id', id)
		.single();

	if (error) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}

	if (!task) {
		return NextResponse.json({ error: 'Task not found' }, { status: 404 });
	}

	// Transform the data to match your Task type
	const formattedTask = {
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
	};

	return NextResponse.json(formattedTask);
}
