'use client';

import { Task } from '@/lib/types';
import { TaskCard } from './task-card';
import { useEffect, useRef } from 'react';

export function TaskCardGrid({ tasks }: { tasks: Task[] }) {
	const gridRef = useRef<HTMLDivElement>(null);

	// Function to equalize heights in each row
	useEffect(() => {
		if (!gridRef.current) return;

		// Get all task cards
		const cards = Array.from(
			gridRef.current.querySelectorAll('.task-card-item')
		);

		// Reset heights first
		cards.forEach((card) => {
			(card as HTMLElement).style.height = 'auto';
		});

		// Determine how many cards per row based on viewport width
		const gridComputedStyle = window.getComputedStyle(gridRef.current);
		const gridTemplateColumns = gridComputedStyle.getPropertyValue(
			'grid-template-columns'
		);
		const columnsCount = gridTemplateColumns.split(' ').length;

		// Group cards by rows
		const rows: HTMLElement[][] = [];
		for (let i = 0; i < cards.length; i += columnsCount) {
			rows.push(cards.slice(i, i + columnsCount) as HTMLElement[]);
		}

		// Set equal height for each row
		rows.forEach((row) => {
			// Find the tallest card in this row
			const maxHeight = Math.max(...row.map((card) => card.scrollHeight));

			// Set all cards in this row to the tallest height
			row.forEach((card) => {
				card.style.height = `${maxHeight}px`;
			});
		});

		// Re-run when window is resized
		const handleResize = () => {
			// Reset and recalculate
			cards.forEach((card) => {
				(card as HTMLElement).style.height = 'auto';
			});

			// Delay to ensure DOM has updated
			setTimeout(() => {
				// Re-run the effect
				if (gridRef.current) {
					const updatedStyle = window.getComputedStyle(
						gridRef.current
					);
					const updatedColumns = updatedStyle.getPropertyValue(
						'grid-template-columns'
					);
					const updatedCount = updatedColumns.split(' ').length;

					const updatedRows: HTMLElement[][] = [];
					for (let i = 0; i < cards.length; i += updatedCount) {
						updatedRows.push(
							cards.slice(i, i + updatedCount) as HTMLElement[]
						);
					}

					updatedRows.forEach((row) => {
						const rowMaxHeight = Math.max(
							...row.map((card) => card.scrollHeight)
						);
						row.forEach((card) => {
							card.style.height = `${rowMaxHeight}px`;
						});
					});
				}
			}, 100);
		};

		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, [tasks]);

	return (
		<div
			ref={gridRef}
			className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
		>
			{tasks.map((task) => (
				<div key={task.id} className="task-card-item">
					<TaskCard task={task} />
				</div>
			))}
		</div>
	);
}
