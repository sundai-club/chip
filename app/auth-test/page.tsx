'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

// Add a type for the server check response
interface AuthCheckResponse {
	authenticated: boolean;
	userId?: string;
	email?: string;
	message?: string;
	error?: string;
}

export default function AuthTestPage() {
	const { user } = useAuth();
	const [serverCheck, setServerCheck] = useState<AuthCheckResponse | null>(
		null
	);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function checkAuth() {
			try {
				const res = await fetch('/api/auth-check', {
					credentials: 'include',
				});
				const data = await res.json();
				setServerCheck(data);
			} catch (error) {
				console.error('Error checking auth:', error);
			} finally {
				setLoading(false);
			}
		}

		checkAuth();
	}, []);

	return (
		<div className="p-8">
			<h1 className="text-2xl font-bold mb-4">Authentication Test</h1>

			<div className="mb-6 p-4 bg-gray-100 rounded">
				<h2 className="text-xl font-semibold mb-2">
					Client-side Auth:
				</h2>
				{user ? (
					<div>
						<p className="text-green-600">✅ Authenticated</p>
						<pre className="mt-2 p-2 bg-gray-200 rounded">
							{JSON.stringify(
								{ id: user.id, email: user.email },
								null,
								2
							)}
						</pre>
					</div>
				) : (
					<p className="text-red-600">❌ Not authenticated</p>
				)}
			</div>

			<div className="p-4 bg-gray-100 rounded">
				<h2 className="text-xl font-semibold mb-2">
					Server-side Auth:
				</h2>
				{loading ? (
					<p>Loading...</p>
				) : serverCheck ? (
					<div>
						{serverCheck.authenticated ? (
							<div>
								<p className="text-green-600">
									✅ Authenticated
								</p>
								<pre className="mt-2 p-2 bg-gray-200 rounded">
									{JSON.stringify(serverCheck, null, 2)}
								</pre>
							</div>
						) : (
							<div>
								<p className="text-red-600">
									❌ Not authenticated
								</p>
								<p className="mt-2">{serverCheck.message}</p>
							</div>
						)}
					</div>
				) : (
					<p>Error checking server authentication</p>
				)}
			</div>
		</div>
	);
}
