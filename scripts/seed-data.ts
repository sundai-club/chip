const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const sampleTasks = [
	{
		title: 'Organize Birthday Party',
		description:
			'Need help planning a surprise birthday party for 20 people',
		due_date: '2023-12-15',
		pledge_amount: 120,
		goal_amount: 200,
		status: 'New',
		contributors: 3,
		category: 'Event',
		image_url: `/animations/animation-1.svg`,
		privacy: 'friends',
	},
	// Add more sample tasks here
	{
		title: 'Airport Pickup',
		description: 'Need someone to pick up my parents from the airport',
		due_date: '2023-11-30',
		pledge_amount: 75,
		goal_amount: 75,
		status: 'Pledged',
		contributors: 2,
		category: 'Transportation',
		image_url: `/animations/animation-2.svg`,
		privacy: 'friends',
	},
	{
		title: 'Catering for Office Party',
		description: 'Looking for someone to arrange catering for 30 people',
		due_date: '2023-12-20',
		pledge_amount: 350,
		goal_amount: 500,
		status: 'Accepted',
		contributors: 5,
		category: 'Food',
		image_url: `/animations/animation-3.svg`,
		privacy: 'public',
	},
];

async function seedData() {
	try {
		// First create a test user if it doesn't exist
		const { data: userData, error: userError } = await supabase.auth.signUp(
			{
				email: 'test@example.com',
				password: 'password123',
			}
		);

		if (userError) {
			console.error('Error creating test user:', userError);
			return;
		}

		const userId = userData.user?.id;

		// Create profile for the user
		const { error: profileError } = await supabase.from('profiles').upsert({
			id: userId,
			username: 'testuser',
			full_name: 'Test User',
		});

		if (profileError) {
			console.error('Error creating profile:', profileError);
			return;
		}

		// Insert sample tasks
		for (const task of sampleTasks) {
			const { error } = await supabase.from('tasks').insert({
				...task,
				created_by: userId,
			});

			if (error) {
				console.error('Error inserting task:', error);
			} else {
				console.log(`Added task: ${task.title}`);
			}
		}

		console.log('Sample data seeded successfully!');
	} catch (error) {
		console.error('Error seeding data:', error);
	}
}

seedData();
