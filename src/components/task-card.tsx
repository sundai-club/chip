import React from 'react';
import { Card, Badge, ProgressBar } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import * as dateUtils from '../utils/date';
import type { Task } from '../lib/types';

interface TaskCardProps {
	task: Task;
}

export const TaskCard = ({ task }: TaskCardProps) => {
	const totalPledged = task.statistics?.total_pledged || 0;
	const progress = task.goal > 0 ? (totalPledged / task.goal) * 100 : 0;

	return (
		<Link 
			to={`/tasks/${task.id}`} 
			className="text-decoration-none"
		>
			<Card className="h-100 transition-all hover:shadow-lg">
				<Card.Img variant="top" src={task.image_url} />
				<Card.Body>
					<div className="d-flex justify-content-between align-items-start mb-2">
						<Card.Title>{task.title}</Card.Title>
						<Badge 
							bg={getStatusBadgeColor(task.status)} 
							style={getStatusStyle(task.status)}
						>
							{task.status}
						</Badge>
					</div>
					<Card.Text>{task.description}</Card.Text>
					<div className="mb-3">
						<small className="text-muted">Due: {dateUtils.formatDate(task.due_date)}</small>
					</div>
					{task.goal > 0 && (
						<>
							<ProgressBar now={progress} label={`${progress.toFixed(0)}%`} />
							<div className="d-flex justify-content-between mt-3">
								<div>
									<small className="text-muted">Contributors: {task.statistics?.contributor_count || 0}</small>
								</div>
								<div>
									<strong>${totalPledged}</strong> / ${task.goal}
								</div>
							</div>
						</>
					)}
				</Card.Body>
			</Card>
		</Link>
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

function getStatusStyle(status: string): React.CSSProperties {
	if (status === 'New') {
		return {
			backgroundColor: '#e7f1ff',
			color: '#0d6efd',
			border: '1px solid #0d6efd',
			fontWeight: 'bold'
		};
	}
	return {
		color: '#fff'
	};
}
