'use client';

import { useEffect, useState } from 'react';
import { TaskCard } from '@/components/task-card';
import { TaskFilter } from '@/components/task-filter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search } from 'lucide-react';
import Link from 'next/link';
import type { Task, FilterTab, SortOption, TaskCategory } from '@/lib/types';
import { Logo } from '@/components/logo';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { TaskCardGrid } from '@/components/task-card-grid';

export default function Dashboard() {
	const [tasks, setTasks] = useState<Task[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [activeTab, setActiveTab] = useState<FilterTab>('all');
	const [searchQuery, setSearchQuery] = useState('');
	const [sortBy, setSortBy] = useState<SortOption>('newest');
	const [selectedCategory, setSelectedCategory] = useState<
		TaskCategory | 'all'
	>('all');
	const { user } = useAuth();
	const router = useRouter();
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		async function fetchTasks() {
			try {
				console.log('Fetching tasks...');
				const response = await fetch('/api/tasks');
				console.log('Tasks response status:', response.status);

				if (!response.ok) {
					const errorData = await response.json();
					console.error('Error fetching tasks:', errorData);
					throw new Error(errorData.error || 'Failed to fetch tasks');
				}

				const data = await response.json();
				console.log('Tasks fetched successfully:', data.length);
				setTasks(data);
			} catch (err: any) {
				console.error('Error in fetchTasks:', err);
				setError(err.message || 'Failed to load tasks');
			} finally {
				setIsLoading(false);
			}
		}

		fetchTasks();
	}, []);

	// Filter tasks based on active tab
	const filterTasksByTab = (tasks: Task[]): Task[] => {
		switch (activeTab) {
			case 'contribute':
				return tasks.filter(
					(task) => task.status === 'New' || task.status === 'Pledged'
				);
			case 'upcoming':
				return tasks.filter((task) => task.status === 'Accepted');
			case 'mytasks':
				return tasks.filter((task) => task.contributors > 0);
			case 'completed':
				return tasks.filter((task) => task.status === 'Completed');
			case 'closed':
				return tasks.filter((task) => task.status === 'Closed');
			default:
				return tasks;
		}
	};

	// Filter tasks based on search query
	const filterTasksBySearch = (tasks: Task[]): Task[] => {
		if (!searchQuery) return tasks;
		const query = searchQuery.toLowerCase();
		return tasks.filter(
			(task) =>
				task.title.toLowerCase().includes(query) ||
				task.description.toLowerCase().includes(query) ||
				task.category.toLowerCase().includes(query)
		);
	};

	// Filter tasks by category
	const filterTasksByCategory = (tasks: Task[]): Task[] => {
		if (selectedCategory === 'all') return tasks;
		return tasks.filter((task) => task.category === selectedCategory);
	};

	// Sort tasks
	const sortTasks = (tasks: Task[]): Task[] => {
		switch (sortBy) {
			case 'dueDate':
				return [...tasks].sort(
					(a, b) =>
						new Date(a.dueDate).getTime() -
						new Date(b.dueDate).getTime()
				);
			case 'amountHighest':
				return [...tasks].sort((a, b) => b.goalAmount - a.goalAmount);
			case 'amountLowest':
				return [...tasks].sort((a, b) => a.goalAmount - b.goalAmount);
			case 'newest':
			default:
				return [...tasks].sort(
					(a, b) => parseInt(b.id) - parseInt(a.id)
				);
		}
	};

	// Apply all filters and sorting
	const filteredTasks = sortTasks(
		filterTasksByCategory(filterTasksBySearch(filterTasksByTab(tasks)))
	);

	console.log('Initial tasks:', tasks);
	console.log('Filtered tasks:', filteredTasks);
	console.log('Active tab:', activeTab);
	console.log('Selected category:', selectedCategory);

	return (
		<div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-500 to-pink-500">
			<header className="sticky top-0 z-10 bg-white/90 backdrop-blur-sm border-b">
				<div className="container flex items-center justify-between h-16 px-4 mx-auto">
					<div className="flex items-center gap-2">
						<Logo />
					</div>
					<div className="flex items-center gap-4">
						<Link href="/create">
							<Button className="bg-[#7B2869] hover:bg-[#3D1766]">
								<Plus className="w-4 h-4 mr-2" />
								Create Task
							</Button>
						</Link>
						{user ? (
							<div className="w-8 h-8 rounded-full bg-[#3D1766] text-white flex items-center justify-center">
								{user.email?.charAt(0).toUpperCase() || 'U'}
							</div>
						) : (
							<Link href="/login">
								<Button variant="outline">Login</Button>
							</Link>
						)}
					</div>
				</div>
			</header>

			<main className="container px-4 py-6 mx-auto">
				<div className="flex flex-col gap-6">
					<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
						<h2 className="text-2xl font-bold text-white">Tasks</h2>
						<div className="relative">
							<Search className="absolute w-4 h-4 transform -translate-y-1/2 left-3 top-1/2 text-gray-500" />
							<Input
								type="search"
								placeholder="Search tasks..."
								className="pl-10 w-full md:w-[300px]"
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
							/>
						</div>
					</div>

					<TaskFilter
						activeTab={activeTab}
						onTabChange={setActiveTab}
						sortBy={sortBy}
						onSortChange={setSortBy}
						selectedCategory={selectedCategory}
						onCategoryChange={setSelectedCategory}
					/>

					{isLoading ? (
						<div className="text-center py-12">
							<p className="text-white text-lg">
								Loading tasks...
							</p>
						</div>
					) : error ? (
						<div className="text-center py-12">
							<p className="text-white text-lg">{error}</p>
						</div>
					) : filteredTasks.length === 0 ? (
						<div className="text-center py-12">
							<p className="text-white text-lg">
								No tasks found matching your criteria.
							</p>
						</div>
					) : (
						<TaskCardGrid tasks={filteredTasks} />
					)}
				</div>
			</main>
		</div>
	);
}
