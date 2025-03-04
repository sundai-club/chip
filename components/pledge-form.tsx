'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase-client';

interface PledgeFormProps {
	taskId: string;
	suggestedAmount?: number;
	onPledgeComplete?: () => void;
}

export function PledgeForm({
	taskId,
	suggestedAmount = 20,
	onPledgeComplete,
}: PledgeFormProps) {
	const [amount, setAmount] = useState(suggestedAmount.toString());
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState('');
	const { user } = useAuth();
	const router = useRouter();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);
		setError('');

		try {
			// Check if user is logged in
			if (!user) {
				console.error('No user found in AuthContext');
				setError('You must be logged in to make a pledge');
				return;
			}

			// Log detailed user info
			console.log('User from AuthContext:', {
				id: user.id,
				email: user.email,
				isAuthenticated: !!user,
			});

			// Check session directly from Supabase
			const { data: sessionData } = await supabase.auth.getSession();
			console.log('Session from Supabase client:', {
				exists: !!sessionData.session,
				userId: sessionData.session?.user?.id,
				expiresAt: sessionData.session?.expires_at,
			});

			// Make the pledge request with detailed logging
			console.log('Making pledge request...');
			const response = await fetch('/api/pledges', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				credentials: 'include', // Important for cookies
				body: JSON.stringify({
					taskId,
					amount: parseFloat(amount),
				}),
			});

			// Log response details
			console.log('Pledge response:', {
				status: response.status,
				statusText: response.statusText,
				headers: Object.fromEntries([...response.headers]),
			});

			const responseData = await response.json();
			console.log('Response data:', responseData);

			if (!response.ok) {
				console.error('Pledge error response:', responseData);
				throw new Error(
					responseData.error || 'Failed to create pledge'
				);
			}

			// Reset form and show success
			setAmount('');
			if (onPledgeComplete) {
				onPledgeComplete();
			}
		} catch (error: any) {
			console.error('Error creating pledge:', error);
			setError(
				error.message || 'An error occurred while creating your pledge'
			);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			<div className="space-y-2">
				<Label htmlFor="pledge-amount">Your Pledge Amount ($)</Label>
				<Input
					id="pledge-amount"
					type="number"
					min="1"
					step="0.01"
					value={amount}
					onChange={(e) => setAmount(e.target.value)}
					placeholder="Enter amount"
					required
				/>
			</div>

			{error && <p className="text-red-500 text-sm">{error}</p>}

			<Button
				type="submit"
				className="w-full bg-[#7B2869] hover:bg-[#3D1766]"
				disabled={isSubmitting}
			>
				{isSubmitting ? 'Processing...' : 'Pledge to Help'}
			</Button>
		</form>
	);
}
