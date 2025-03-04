'use client';

import { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';

interface Pledge {
	id: string;
	amount: number;
	created_at: string;
	profiles: {
		username: string;
		avatar_url: string | null;
	};
}

export function PledgesList({ taskId }: { taskId: string }) {
	const [pledges, setPledges] = useState<Pledge[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function fetchPledges() {
			try {
				const response = await fetch(`/api/pledges?taskId=${taskId}`);
				if (!response.ok) {
					throw new Error('Failed to fetch pledges');
				}
				const data = await response.json();
				setPledges(data);
			} catch (error) {
				console.error('Error fetching pledges:', error);
			} finally {
				setLoading(false);
			}
		}

		fetchPledges();
	}, [taskId]);

	if (loading) {
		return <p className="text-center py-4">Loading pledges...</p>;
	}

	if (pledges.length === 0) {
		return (
			<p className="text-center py-4 text-gray-500">
				No pledges yet. Be the first to contribute!
			</p>
		);
	}

	return (
		<div className="space-y-3">
			<h3 className="font-semibold text-lg">Contributors</h3>
			<div className="space-y-2">
				{pledges.map((pledge) => (
					<Card key={pledge.id} className="bg-gray-50">
						<CardContent className="p-3 flex items-center justify-between">
							<div className="flex items-center gap-3">
								<Avatar className="h-8 w-8">
									<AvatarImage
										src={
											pledge.profiles.avatar_url ||
											undefined
										}
									/>
									<AvatarFallback>
										{pledge.profiles.username
											.charAt(0)
											.toUpperCase()}
									</AvatarFallback>
								</Avatar>
								<span className="font-medium">
									{pledge.profiles.username}
								</span>
							</div>
							<span className="font-semibold text-[#7B2869]">
								${pledge.amount.toFixed(2)}
							</span>
						</CardContent>
					</Card>
				))}
			</div>
		</div>
	);
}
