'use client';

import { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface Contributor {
	id: string;
	amount: number;
	profiles: {
		username: string;
		avatar_url: string | null;
	};
}

export function TopContributors({ taskId }: { taskId: string }) {
	const [contributors, setContributors] = useState<Contributor[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function fetchContributors() {
			try {
				const response = await fetch(`/api/pledges?taskId=${taskId}`);
				if (!response.ok) {
					throw new Error('Failed to fetch contributors');
				}
				const data = await response.json();

				// Check if data is an array before sorting
				if (Array.isArray(data) && data.length > 0) {
					const topContributors = data
						.sort((a, b) => b.amount - a.amount)
						.slice(0, 3);
					setContributors(topContributors);
				} else {
					setContributors([]);
				}
			} catch (error) {
				console.error('Error fetching contributors:', error);
				setContributors([]);
			} finally {
				setLoading(false);
			}
		}

		fetchContributors();
	}, [taskId]);

	return (
		<div className="w-full">
			<div className="text-xs text-gray-500 mb-1">Top Contributors:</div>
			<div className="h-10 flex items-center">
				{loading ? (
					<div className="w-full h-6 animate-pulse bg-gray-200 rounded"></div>
				) : contributors.length > 0 ? (
					<div className="flex items-center overflow-hidden whitespace-nowrap">
						{contributors.map((contributor, index) => (
							<div
								key={contributor.id}
								className="flex items-center mr-2"
								title={`${
									contributor.profiles.username || 'Anonymous'
								} - $${contributor.amount.toFixed(2)}`}
							>
								<Avatar className="h-6 w-6 mr-1">
									<AvatarImage
										src={
											contributor.profiles.avatar_url ||
											'/default-avatar.png'
										}
									/>
									<AvatarFallback>
										{contributor.profiles.username
											.charAt(0)
											.toUpperCase()}
									</AvatarFallback>
								</Avatar>
								<span className="text-sm truncate max-w-[80px]">
									{contributor.profiles.username ||
										'Anonymous'}
								</span>
							</div>
						))}
						{contributors.length > 3 && (
							<span className="text-sm text-gray-500">...</span>
						)}
					</div>
				) : (
					<div className="text-sm text-gray-400 h-6 flex items-center">
						No contributors yet
					</div>
				)}
			</div>
		</div>
	);
}
