'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
	format,
	addMonths,
	subMonths,
	startOfMonth,
	endOfMonth,
	eachDayOfInterval,
	isSameMonth,
	isSameDay,
	isToday,
} from 'date-fns';
import { cn } from '@/lib/utils';

interface CustomDatePickerProps {
	selected?: Date;
	onSelect: (date: Date) => void;
	className?: string;
}

export function CustomDatePicker({
	selected,
	onSelect,
	className,
}: CustomDatePickerProps) {
	const [currentMonth, setCurrentMonth] = useState(new Date());
	const [calendarDays, setCalendarDays] = useState<Date[]>([]);
	const [tempSelected, setTempSelected] = useState<Date | undefined>(
		selected
	);

	// Update tempSelected when selected prop changes
	useEffect(() => {
		setTempSelected(selected);
	}, [selected]);

	// Generate calendar days whenever the month changes
	useEffect(() => {
		const firstDay = startOfMonth(currentMonth);
		const lastDay = endOfMonth(currentMonth);
		const days = eachDayOfInterval({ start: firstDay, end: lastDay });

		// Add days from previous month to start on Sunday
		const startDay = firstDay.getDay(); // 0 = Sunday, 1 = Monday, etc.
		if (startDay > 0) {
			const prevMonthDays = eachDayOfInterval({
				start: subMonths(firstDay, 1),
				end: subMonths(firstDay, 1),
			}).slice(-startDay);
			days.unshift(...prevMonthDays);
		}

		// Add days from next month to complete the grid
		const endDay = lastDay.getDay();
		if (endDay < 6) {
			const nextMonthDays = eachDayOfInterval({
				start: addMonths(lastDay, 1),
				end: addMonths(lastDay, 1),
			}).slice(0, 6 - endDay);
			days.push(...nextMonthDays);
		}

		setCalendarDays(days);
	}, [currentMonth]);

	const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
	const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

	// This now only updates the temporary selection
	const handleDateSelect = (date: Date) => {
		setTempSelected(date);
	};

	// This confirms the selection and calls the parent's onSelect
	const confirmSelection = () => {
		if (tempSelected) {
			onSelect(tempSelected);
			// The parent component will handle closing the dialog
		}
	};

	const weekdays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

	return (
		<div className={cn('p-4 bg-white rounded-md', className)}>
			{/* Month navigation */}
			<div className="flex items-center justify-between mb-4">
				<Button variant="outline" size="icon" onClick={prevMonth}>
					<ChevronLeft className="h-4 w-4" />
				</Button>
				<h2 className="text-lg font-medium">
					{format(currentMonth, 'MMMM yyyy')}
				</h2>
				<Button variant="outline" size="icon" onClick={nextMonth}>
					<ChevronRight className="h-4 w-4" />
				</Button>
			</div>

			{/* Calendar grid */}
			<div className="grid grid-cols-7 gap-1">
				{/* Weekday headers */}
				{weekdays.map((day) => (
					<div
						key={day}
						className="h-9 flex items-center justify-center text-sm font-medium text-gray-500"
					>
						{day}
					</div>
				))}

				{/* Calendar days */}
				{calendarDays.map((day, i) => {
					const isCurrentMonth = isSameMonth(day, currentMonth);
					const isSelectedDay = tempSelected
						? isSameDay(day, tempSelected)
						: false;
					const isTodayDate = isToday(day);

					return (
						<Button
							key={i}
							variant="ghost"
							className={cn(
								'h-9 w-9 p-0 font-normal',
								!isCurrentMonth && 'text-gray-400 opacity-50',
								isSelectedDay &&
									'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground',
								isTodayDate &&
									!isSelectedDay &&
									'bg-accent text-accent-foreground'
							)}
							onClick={() => handleDateSelect(day)}
						>
							{format(day, 'd')}
						</Button>
					);
				})}
			</div>

			{/* Confirm button */}
			<div className="mt-4 border-t pt-4">
				<Button
					className="w-full"
					disabled={!tempSelected}
					onClick={confirmSelection}
				>
					Confirm Date
				</Button>
			</div>
		</div>
	);
}
