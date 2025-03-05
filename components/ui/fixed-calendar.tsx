'use client';

import { useEffect, useRef } from 'react';
import { Calendar } from '@/components/ui/calendar';
import type { CalendarProps } from '@/components/ui/calendar';

export function FixedCalendar(props: CalendarProps) {
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!ref.current) return;

		// Apply fixes after render
		const headerCells = ref.current.querySelectorAll('.rdp-head_cell');
		headerCells.forEach((cell) => {
			(cell as HTMLElement).style.textAlign = 'center';
			(cell as HTMLElement).style.width = '40px';
		});

		// More fixes as needed...
	}, []);

	return (
		<div ref={ref} className="calendar-wrapper">
			<Calendar {...props} />
		</div>
	);
}
