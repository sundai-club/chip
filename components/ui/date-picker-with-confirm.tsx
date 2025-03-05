'use client';

import { useState } from 'react';
import { CustomCalendar } from '@/components/ui/custom-calendar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface DatePickerWithConfirmProps {
	date: Date | undefined;
	onDateChange: (date: Date | undefined) => void;
	className?: string;
}

export function DatePickerWithConfirm({
	date,
	onDateChange,
	className,
}: DatePickerWithConfirmProps) {
	const [selectedDate, setSelectedDate] = useState<Date | undefined>(date);

	const handleConfirm = () => {
		onDateChange(selectedDate);
	};

	return (
		<div className={cn('flex flex-col space-y-4', className)}>
			<CustomCalendar
				mode="single"
				selected={selectedDate}
				onSelect={setSelectedDate}
				initialFocus
			/>
			<div className="flex justify-end">
				<Button
					onClick={handleConfirm}
					disabled={!selectedDate}
					className="w-full sm:w-auto"
				>
					Confirm Date
				</Button>
			</div>
		</div>
	);
}
