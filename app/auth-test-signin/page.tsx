'use client';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function AuthTestSignIn() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
	const { signIn } = useAuth();
	const router = useRouter();

	const handleSignIn = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError('');

		try {
			const result = await signIn(email, password);
			console.log('Sign in result:', result);

			// Check cookies after sign in
			console.log('Document cookies:', document.cookie);

			// Redirect to auth test page
			router.push('/auth-test');
		} catch (err: any) {
			console.error('Sign in error:', err);
			setError(err.message || 'Failed to sign in');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="p-8 max-w-md mx-auto">
			<h1 className="text-2xl font-bold mb-6">
				Authentication Test Sign In
			</h1>

			<form onSubmit={handleSignIn} className="space-y-4">
				<div>
					<label className="block mb-1">Email</label>
					<input
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						className="w-full p-2 border rounded"
						required
					/>
				</div>

				<div>
					<label className="block mb-1">Password</label>
					<input
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						className="w-full p-2 border rounded"
						required
					/>
				</div>

				{error && <p className="text-red-500">{error}</p>}

				<button
					type="submit"
					disabled={loading}
					className="w-full p-2 bg-blue-500 text-white rounded"
				>
					{loading ? 'Signing in...' : 'Sign In'}
				</button>
			</form>
		</div>
	);
}
