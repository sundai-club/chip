import React from 'react';
import { Card, Badge, ProgressBar } from 'react-bootstrap';
import * as dateUtils from '../utils/date';
import type { Task } from '../lib/types';

interface TaskCardProps {
	task: Task;
}

export const TaskCard = ({ task }: TaskCardProps) => {
	const progress = (task.pledgeAmount / task.goalAmount) * 100;

	return (
		<Card>
			<Card.Img variant="top" src={task.imageUrl} />
			<Card.Body>
				<div className="d-flex justify-content-between align-items-start mb-2">
					<Card.Title>{task.title}</Card.Title>
					<Badge bg={getStatusBadgeColor(task.status)}>{task.status}</Badge>
				</div>
				<Card.Text>{task.description}</Card.Text>
				<div className="mb-3">
					<small className="text-muted">Due: {dateUtils.formatDate(task.dueDate)}</small>
				</div>
				<ProgressBar now={progress} label={`${progress.toFixed(0)}%`} />
				<div className="d-flex justify-content-between mt-3">
					<div>
						<small className="text-muted">Contributors: {task.contributors}</small>
					</div>
					<div>
						<strong>${task.pledgeAmount}</strong> / ${task.goalAmount}
					</div>
				</div>
			</Card.Body>
		</Card>
	);
};

function getStatusBadgeColor(status: string): string {
	switch (status) {
		case 'New': return 'primary';
		case 'Pledged': return 'info';
		case 'Accepted': return 'warning';
		case 'Completed': return 'success';
		case 'Closed': return 'secondary';
		default: return 'light';
	}
}
