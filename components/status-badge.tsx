import { Badge } from '@/components/ui/badge';

export function StatusBadge({ status }: { status: string }) {
	// Log the status to debug
	console.log('StatusBadge called with status:', status);

	// Never show "Pledged" based on task.status
	if (status.toLowerCase() === 'pledged') {
		// Override this to show "Open" instead
		console.log('Overriding "pledged" status to "open"');
		return (
			<Badge
				variant="outline"
				className="bg-green-100 text-green-800 border-green-300"
			>
				Open
			</Badge>
		);
	}

	switch (status) {
		case 'open':
			return (
				<Badge
					variant="outline"
					className="bg-green-100 text-green-800 border-green-300"
				>
					Open
				</Badge>
			);
		case 'in_progress':
			return (
				<Badge
					variant="outline"
					className="bg-blue-100 text-blue-800 border-blue-300"
				>
					In Progress
				</Badge>
			);
		case 'completed':
			return (
				<Badge
					variant="outline"
					className="bg-gray-100 text-gray-800 border-gray-300"
				>
					Completed
				</Badge>
			);
		case 'cancelled':
			return (
				<Badge
					variant="outline"
					className="bg-red-100 text-red-800 border-red-300"
				>
					Cancelled
				</Badge>
			);
		default:
			return (
				<Badge
					variant="outline"
					className="bg-gray-100 text-gray-800 border-gray-300"
				>
					{status}
				</Badge>
			);
	}
}
