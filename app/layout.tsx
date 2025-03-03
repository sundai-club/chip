import type React from 'react';
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/contexts/AuthContext';
import Navbar from '@/components/navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'Chip - Community Task Sharing Platform',
	description: 'Share tasks, pool resources, and get things done together',
	generator: 'v0.dev',
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body className={inter.className}>
				<AuthProvider>
					<Navbar />
					<main className="container mx-auto px-4 py-8">
						{children}
					</main>
				</AuthProvider>
			</body>
		</html>
	);
}

import './globals.css';
