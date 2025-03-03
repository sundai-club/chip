import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Try to load environment variables from different possible locations
const envPaths = [
	'../app/.env.local', // Check app directory first
	'../app/.env.development.local',
	'../.env.local',
	'../.env',
];

let envLoaded = false;

for (const envPath of envPaths) {
	const fullPath = resolve(__dirname, envPath);
	console.log(`Checking for env file at: ${fullPath}`);
	if (fs.existsSync(fullPath)) {
		console.log(`Loading environment from: ${fullPath}`);
		dotenv.config({ path: fullPath });
		envLoaded = true;
		break;
	}
}

if (!envLoaded) {
	console.warn(
		'No .env file found. Please provide Supabase credentials as arguments.'
	);
}

// Get Supabase credentials either from env or command line arguments
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.argv[2];
const supabaseKey =
	process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.argv[3];

if (!supabaseUrl || !supabaseKey) {
	console.error('Error: Supabase URL and key are required.');
	console.error(
		'Usage: node scripts/seed-data.js [supabaseUrl] [supabaseKey]'
	);
	console.error(
		'Or set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local'
	);
	process.exit(1);
}

console.log(`Using Supabase URL: ${supabaseUrl}`);
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

// Update the email address to something more realistic
const testEmail = 'test.user@gmail.com'; // Change this to any valid email format

async function seedData() {
	try {
		// First create a test user if it doesn't exist
		const { data: userData, error: userError } = await supabase.auth.signUp(
			{
				email: testEmail,
				password: 'password123',
			}
		);

		if (userError) {
			console.error('Error creating test user:', userError);

			// If the user already exists, try to sign in instead
			if (userError.message.includes('already registered')) {
				console.log('User already exists, trying to sign in...');
				const { data: signInData, error: signInError } =
					await supabase.auth.signInWithPassword({
						email: testEmail,
						password: 'password123',
					});

				if (signInError) {
					console.error('Error signing in:', signInError);
					return;
				}

				console.log('Signed in successfully');
				return signInData.user.id;
			}

			return;
		}

		const userId = userData.user?.id;
		console.log(`Created user with ID: ${userId}`);
		return userId;
	} catch (error) {
		console.error('Error in user creation:', error);
		return null;
	}
}

// Update the main function to use the userId returned from seedData
async function main() {
	const userId = await seedData();

	if (!userId) {
		console.error('Failed to get a valid user ID');
		return;
	}

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

	console.log('Created user profile');

	// Insert sample tasks
	for (const task of sampleTasks) {
		const { error } = await supabase.from('tasks').insert({
			...task,
			created_by: userId,
		});

		if (error) {
			console.error(`Error inserting task "${task.title}":`, error);
		} else {
			console.log(`Added task: ${task.title}`);
		}
	}

	console.log('Sample data seeded successfully!');
}

main();
