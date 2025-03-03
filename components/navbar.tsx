'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

export default function Navbar() {
	const { user, signOut } = useAuth();

	return (
		<header className="border-b">
			<div className="container mx-auto px-4 py-3 flex justify-between items-center">
				<Link href="/" className="font-bold text-xl text-[#3D1766]">
					TaskShare
				</Link>

				<div className="flex items-center gap-4">
					{user ? (
						<div className="flex items-center gap-2">
							<span className="text-sm">{user.email}</span>
							<Button variant="ghost" size="sm" onClick={signOut}>
								Sign Out
							</Button>
						</div>
					) : (
						<div className="flex items-center gap-2">
							<Link href="/login">
								<Button variant="ghost" size="sm">
									Log In
								</Button>
							</Link>
							<Link href="/signup">
								<Button
									className="bg-[#7B2869] hover:bg-[#3D1766]"
									size="sm"
								>
									Sign Up
								</Button>
							</Link>
						</div>
					)}
				</div>
			</div>
		</header>
	);
}
