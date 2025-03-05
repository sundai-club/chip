'use client';

import { useEffect, useRef } from 'react';
import { Calendar as BaseCalendar } from '@/components/ui/calendar';
import type { CalendarProps } from '@/components/ui/calendar';

export function CustomCalendar(props: CalendarProps) {
	const calendarRef = useRef<HTMLDivElement>(null);

	// Apply direct DOM manipulation to fix alignment
	useEffect(() => {
		if (!calendarRef.current) return;

		// Find all header cells and day cells
		const headerCells =
			calendarRef.current.querySelectorAll('.rdp-head_cell');
		const dayCells = calendarRef.current.querySelectorAll('.rdp-cell');

		// Apply direct styles to ensure alignment
		headerCells.forEach((cell) => {
			(cell as HTMLElement).style.width = '40px';
			(cell as HTMLElement).style.textAlign = 'center';
			(cell as HTMLElement).style.display = 'flex';
			(cell as HTMLElement).style.justifyContent = 'center';
		});

		// Ensure the rows are properly aligned
		const headRow = calendarRef.current.querySelector('.rdp-head_row');
		const dayRows = calendarRef.current.querySelectorAll('.rdp-row');

		if (headRow) {
			(headRow as HTMLElement).style.display = 'flex';
			(headRow as HTMLElement).style.justifyContent = 'space-around';
			(headRow as HTMLElement).style.width = '100%';
		}

		dayRows.forEach((row) => {
			(row as HTMLElement).style.display = 'flex';
			(row as HTMLElement).style.justifyContent = 'space-around';
			(row as HTMLElement).style.width = '100%';
		});
	}, []);

	return (
		<div ref={calendarRef} className="custom-calendar-wrapper">
			<BaseCalendar {...props} />
		</div>
	);
}
