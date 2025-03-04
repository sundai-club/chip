'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase-client';
import { Session, User, WeakPassword } from '@supabase/supabase-js';

type AuthContextType = {
	user: User | null;
	session: Session | null;
	isLoading: boolean;
	signIn: (
		email: string,
		password: string
	) => Promise<{
		user: User;
		session: Session;
		weakPassword?: WeakPassword;
	}>;
	signUp: (
		email: string,
		password: string,
		username: string
	) => Promise<void>;
	signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<User | null>(null);
	const [session, setSession] = useState<Session | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((_event, session) => {
			setSession(session);
			setUser(session?.user ?? null);
			setIsLoading(false);
		});

		return () => {
			subscription.unsubscribe();
		};
	}, []);

	const signIn = async (email: string, password: string) => {
		try {
			// Clear any existing sessions first
			await supabase.auth.signOut();

			// Sign in with password
			const { data, error } = await supabase.auth.signInWithPassword({
				email,
				password,
			});

			if (error) throw error;

			setUser(data.user);
			setSession(data.session);

			console.log('Auth session after sign in:', data.session);

			// Explicitly set the session in cookies via an API call
			if (data.session) {
				try {
					const response = await fetch('/api/auth/session', {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
							Authorization: `Bearer ${data.session.access_token}`,
						},
						body: JSON.stringify({
							refresh_token: data.session.refresh_token,
						}),
					});

					if (!response.ok) {
						console.error(
							'Failed to set session cookie:',
							await response.text()
						);
					} else {
						console.log('Session cookie set successfully');
					}
				} catch (e) {
					console.error('Error setting session cookie:', e);
				}
			}

			return data;
		} catch (error) {
			console.error('Error signing in:', error);
			throw error;
		}
	};

	const signUp = async (
		email: string,
		password: string,
		username: string
	) => {
		const { error, data } = await supabase.auth.signUp({ email, password });
		if (error) throw error;

		if (data.user) {
			const { error: profileError } = await supabase
				.from('profiles')
				.insert({
					id: data.user.id,
					username,
					full_name: username,
					created_at: new Date().toISOString(),
				});

			if (profileError) {
				console.error('Error creating profile:', profileError);
				await supabase.auth.admin.deleteUser(data.user.id);
				throw new Error('Failed to create user profile');
			}
		}
	};

	const signOut = async () => {
		const { error } = await supabase.auth.signOut();
		if (error) throw error;
	};

	return (
		<AuthContext.Provider
			value={{ user, session, isLoading, signIn, signUp, signOut }}
		>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;
}
