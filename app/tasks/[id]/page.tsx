'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import { Task } from '@/lib/types';

export default function TaskDetailPage() {
	const { id } = useParams();
	const [task, setTask] = useState<Task | null>(null);
	const [loading, setLoading] = useState(true);
	const { user } = useAuth();
	const router = useRouter();

	useEffect(() => {
		async function fetchTask() {
			try {
				const response = await fetch(`/api/tasks/${id}`);
				if (!response.ok) {
					throw new Error('Failed to fetch task');
				}
				const data = await response.json();
				setTask(data);
			} catch (error) {
				console.error('Error fetching task:', error);
			} finally {
				setLoading(false);
			}
		}

		if (id) {
			fetchTask();
		}
	}, [id]);

	if (loading) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-500 to-pink-500 flex items-center justify-center">
				<p className="text-white text-xl">Loading task...</p>
			</div>
		);
	}

	if (!task) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-500 to-pink-500 flex items-center justify-center">
				<Card className="w-full max-w-md">
					<CardContent className="p-6">
						<h1 className="text-xl font-bold mb-4">
							Task Not Found
						</h1>
						<p className="mb-4">
							The task you're looking for doesn't exist or has
							been removed.
						</p>
						<Link href="/">
							<Button className="w-full">
								Back to Dashboard
							</Button>
						</Link>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-500 to-pink-500">
			<header className="sticky top-0 z-10 bg-white/90 backdrop-blur-sm border-b">
				<div className="container flex items-center justify-between h-16 px-4 mx-auto">
					<div className="flex items-center gap-2">
						<Link href="/">
							<h1 className="text-xl font-bold text-[#3D1766]">
								TaskShare
							</h1>
						</Link>
					</div>
					<div className="flex items-center gap-4">
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
				<div className="max-w-3xl mx-auto">
					<div className="mb-6">
						<Link href="/" className="text-white hover:underline">
							← Back to tasks
						</Link>
					</div>

					<Card className="bg-white/95 backdrop-blur-sm shadow-lg">
						<CardHeader>
							<h1 className="text-2xl font-bold">{task.title}</h1>
							<div className="flex items-center justify-between mt-2">
								<span className="text-sm text-gray-500">
									Category: {task.category}
								</span>
								<span className="text-sm text-gray-500">
									Due: {format(new Date(task.dueDate), 'PPP')}
								</span>
							</div>
						</CardHeader>
						<CardContent className="space-y-6">
							{task.imageUrl && (
								<div className="w-full h-[250px] relative rounded-lg overflow-hidden">
									<Image
										src={task.imageUrl}
										alt={task.title}
										fill
										className="object-cover"
									/>
								</div>
							)}

							<div className="p-4 bg-gray-50 rounded-lg">
								<h2 className="font-semibold mb-2">
									Description
								</h2>
								<p className="text-gray-700">
									{task.description}
								</p>
							</div>

							<div className="grid grid-cols-2 gap-4">
								<div className="p-4 bg-purple-50 rounded-lg">
									<h2 className="font-semibold mb-2">
										Pledge Goal
									</h2>
									<p className="text-2xl font-bold text-purple-700">
										${task.goalAmount}
									</p>
									<p className="text-sm text-gray-500">
										${task.pledgeAmount} pledged so far
									</p>
								</div>
								<div className="p-4 bg-blue-50 rounded-lg">
									<h2 className="font-semibold mb-2">
										Contributors
									</h2>
									<p className="text-2xl font-bold text-blue-700">
										{task.contributors}
									</p>
									<p className="text-sm text-gray-500">
										people helping
									</p>
								</div>
							</div>

							<div className="flex justify-center">
								<Button className="bg-[#7B2869] hover:bg-[#3D1766] w-full max-w-md">
									Pledge to Help
								</Button>
							</div>
						</CardContent>
					</Card>
				</div>
			</main>
		</div>
	);
}
