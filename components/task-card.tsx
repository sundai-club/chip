import { Calendar, Users } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import type { Task } from '@/lib/types';
import Image from 'next/image';
import { TopContributors } from '@/components/top-contributors';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState, useRef } from 'react';

interface TaskCardProps {
	task: Task;
}

interface Pledge {
	id: string;
	user_id: string;
	amount: number;
	created_at: string;
	profiles?: {
		username: string;
		avatar_url: string | null;
	};
}

// Comment out console.log at the top of the file
// console.log('TASK CARD MODULE LOADED');

export function TaskCard({ task }: TaskCardProps) {
	// Comment out initial render log
	// console.log(`TASK CARD COMPONENT RENDERED: ${task.id}`);

	const { user } = useAuth();
	const [hasUserPledged, setHasUserPledged] = useState(false);
	const [forceUpdate, setForceUpdate] = useState(0);
	const [isCheckingPledge, setIsCheckingPledge] = useState(false);

	// Comment out debug logs
	// console.log(`TASK CARD DEBUG - ID: ${task.id}, Title: ${task.title}, Status: ${task.status}`);
	// console.log(`🔍 TASK CARD INIT: ${task.id} (${task.title})`);

	// Use a ref to track the current pledge status
	const pledgeStatusRef = useRef(hasUserPledged);

	useEffect(() => {
		// Reset state when task changes
		setHasUserPledged(false);
	}, [task.id]);

	useEffect(() => {
		// Comment out effect logs
		// console.log(`PLEDGE CHECK EFFECT for task ${task.id}`);
		// console.log(`User: ${user ? user.id : 'No user'}`);

		if (!user) return;

		// console.log('Will check pledges now');

		setIsCheckingPledge(true);

		// Simplified pledge check
		fetch(`/api/pledges?taskId=${task.id}`)
			.then((response) => {
				// console.log(`Pledge API response status: ${response.status}`);
				return response.json();
			})
			.then((pledges) => {
				// console.log(`Got ${pledges.length} pledges for task ${task.id}`);
				const userHasPledged = pledges.some(
					(p: Pledge) => p.user_id === user.id
				);
				// console.log(`User has pledged: ${userHasPledged}`);
				setHasUserPledged(userHasPledged);
				setIsCheckingPledge(false);
			})
			.catch((error) => {
				console.error('Error checking pledges:', error);
				setIsCheckingPledge(false);
			});
	}, [task.id, user]);

	// Comment out state change tracking
	// useEffect(() => {
	//   console.log(`hasUserPledged state changed to: ${hasUserPledged}`);
	// }, [hasUserPledged]);

	const daysLeft = getDaysLeft(task.dueDate);
	const progressPercentage = (task.pledgeAmount / task.goalAmount) * 100;
	const formattedDueDate = new Date(task.dueDate).toLocaleDateString(
		'en-US',
		{
			month: 'short',
			day: 'numeric',
			year: 'numeric',
		}
	);

	// Comment out data logging
	// console.log('Task data:', { ... });
	// console.log('TaskCard render state:', { ... });
	// console.log('TaskCard initial render for task:', { ... });

	// Comment out render section logging
	// useEffect(() => {
	//   console.log(`🎨 RENDERING WITH PLEDGE STATUS: ${task.id} = ${hasUserPledged ? 'PLEDGED' : 'NOT PLEDGED'}`);
	// }, [hasUserPledged, task.id]);

	// console.log(`RENDERING BADGE - Task: ${task.id}, User: ${!!user}, HasPledged: ${hasUserPledged}, Status: ${task.status}`);

	return (
		<Link
			href={`/tasks/${task.id}`}
			key={`task-${task.id}-pledged-${hasUserPledged.toString()}`}
			className="h-full block"
		>
			<Card className="h-full overflow-hidden transition-all duration-200 hover:shadow-lg bg-white/90 backdrop-blur-sm border-0">
				<CardHeader className="p-4 pb-0">
					<div
						key={`${task.id}-${hasUserPledged}`}
						className="flex items-start justify-between"
					>
						<div className="flex flex-col">
							<h3 className="text-lg font-semibold line-clamp-1">
								{task.title}
							</h3>
							<p className="text-sm text-gray-500">
								{task.category}
							</p>
						</div>
						{/* Only show Pledged badge if user has actually pledged */}
						{user ? (
							isCheckingPledge ? (
								<Badge>Checking...</Badge>
							) : hasUserPledged ? (
								<Badge
									variant="outline"
									className="bg-purple-100 text-purple-800 border-purple-300"
								>
									Pledged
								</Badge>
							) : (
								<>
									{/* Removed debug logging */}
									<StatusBadge status={task.status} />
								</>
							)
						) : (
							<>
								{/* Removed debug logging */}
								<StatusBadge status={task.status} />
							</>
						)}
					</div>
				</CardHeader>

				{/* Task Image - Fixed height with position relative instead of using fill */}
				<div className="w-full h-40 relative overflow-hidden">
					{task.imageUrl && (
						<Image
							src={task.imageUrl}
							alt={task.title}
							width={400}
							height={160}
							className="w-full h-full object-cover"
							onError={(e) => {
								console.error(
									`Error loading image: ${task.imageUrl}`
								);
								// Fallback for broken images
								(e.target as HTMLImageElement).src =
									'/animations/animation-1.svg';
							}}
						/>
					)}
				</div>

				<CardContent className="p-4 relative z-10 bg-white">
					{/* Task Description */}
					<p className="mb-4 text-sm text-gray-600 line-clamp-2">
						{task.description}
					</p>

					{/* Pledge Progress */}
					<div className="mb-4 p-3 bg-purple-50 rounded-lg">
						<div className="flex items-center justify-between mb-1">
							<span className="text-sm font-medium text-purple-700">
								Pledged Amount
							</span>
							<span className="text-sm font-bold text-purple-700">
								${task.pledgeAmount} of ${task.goalAmount}
							</span>
						</div>
						<Progress
							value={progressPercentage}
							className="h-2 mb-2"
						/>

						{/* Make the percentage visible */}
						<div className="text-xs text-right text-purple-600">
							{Math.round(progressPercentage)}% funded
						</div>
					</div>

					{/* Due Date and Contributors - Make more prominent */}
					<div className="grid grid-cols-2 gap-2">
						<div className="flex flex-col p-2 bg-blue-50 rounded-lg">
							<div className="flex items-center gap-1 text-sm font-medium text-blue-700 mb-1">
								<Calendar className="w-4 h-4" />
								<span>Due Date</span>
							</div>
							<span className="text-sm text-blue-800">
								{daysLeft > 0
									? `${daysLeft} days left`
									: daysLeft === 0
									? 'Due today'
									: 'Overdue'}
							</span>
							<span className="text-xs text-blue-600">
								{formattedDueDate}
							</span>
						</div>

						<div className="flex flex-col p-2 bg-green-50 rounded-lg">
							<div className="flex items-center gap-1 text-sm font-medium text-green-700 mb-1">
								<Users className="w-4 h-4" />
								<span>Contributors</span>
							</div>
							<span className="text-sm text-green-800">
								{task.contributors} people
							</span>
							<span className="text-xs text-green-600">
								supporting this task
							</span>
						</div>
					</div>
				</CardContent>

				{/* Top Contributors */}
				<div className="px-4 pb-2 bg-white">
					<TopContributors taskId={task.id} />
				</div>

				{/* Card Footer */}
				<CardFooter className="p-4 pt-0 border-t bg-white">
					<div className="flex items-center justify-between w-full">
						<div className="text-lg font-semibold text-[#3D1766]">
							${task.pledgeAmount}
						</div>
						{user && hasUserPledged ? (
							<Button size="sm" variant="outline" disabled>
								You Pledged
							</Button>
						) : (
							<ActionButton status={task.status} />
						)}
					</div>
				</CardFooter>
			</Card>
		</Link>
	);
}

function StatusBadge({ status }: { status: string }) {
	switch (status) {
		case 'New':
			return (
				<Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
					New
				</Badge>
			);
		case 'Pledged':
			return (
				<Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">
					Pledged
				</Badge>
			);
		case 'Accepted':
			return (
				<Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
					Accepted
				</Badge>
			);
		case 'Completed':
			return (
				<Badge className="bg-green-100 text-green-800 hover:bg-green-100">
					Completed
				</Badge>
			);
		case 'Closed':
			return (
				<Badge className="bg-red-100 text-red-800 hover:bg-red-100">
					Closed
				</Badge>
			);
		default:
			return null;
	}
}

function ActionButton({ status }: { status: string }) {
	switch (status) {
		case 'New':
		case 'Pledged':
			return (
				<Button
					size="sm"
					variant="outline"
					className="text-[#7B2869] border-[#7B2869] hover:bg-[#7B2869] hover:text-white"
				>
					Pledge
				</Button>
			);
		case 'Accepted':
			return (
				<Button size="sm" variant="outline" disabled>
					Accepted
				</Button>
			);
		case 'Completed':
			return (
				<Button size="sm" variant="outline" disabled>
					Completed
				</Button>
			);
		default:
			return null;
	}
}

function getDaysLeft(dueDate: string): number {
	const today = new Date();
	const due = new Date(dueDate);
	const diffTime = due.getTime() - today.getTime();
	const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
	return diffDays;
}
