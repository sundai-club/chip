// Moving types to a separate file for better organization
export type TaskStatus =
	| 'New'
	| 'Pledged'
	| 'Accepted'
	| 'Completed'
	| 'Closed';
export type TaskCategory =
	| 'Event'
	| 'Transportation'
	| 'Food'
	| 'Shopping'
	| 'Entertainment'
	| 'Other'
	| 'all';

export interface Task {
	xid: number;
	title: string;
	description: string;
	dueDate: string;
	pledgeAmount: number;
	goalAmount: number;
	status: TaskStatus;
	contributors: number;
	category: string;
	imageUrl: string;
	gifUrl?: string;
}

export type FilterTab =
	| 'all'
	| 'contribute'
	| 'upcoming'
	| 'mytasks'
	| 'completed'
	| 'closed';
export type SortOption =
	| 'newest'
	| 'dueDate'
	| 'amountHighest'
	| 'amountLowest';
