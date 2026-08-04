import { Session, User } from '@supabase/supabase-js';
import React, {
	createContext,
	ReactNode,
	useCallback,
	useContext,
	useEffect,
	useState,
} from 'react';
import { supabase } from '../supabase/supabase-utils';

interface SupabaseContextValue {
	user: User | null;
	session: Session | null;
	authLoading: boolean;
	signInWithPassword: (email: string, password: string) => Promise<void>;
	signUpWithPassword: (email: string, password: string) => Promise<void>;
	signOut: () => Promise<void>;
}

const SupabaseContext = createContext<SupabaseContextValue | null>(null);

function SupabaseProvider({ children }: { children: ReactNode }) {
	const [session, setSession] = useState<Session | null>(null);
	const [authLoading, setAuthLoading] = useState(true);

	useEffect(() => {
		supabase.auth.getSession().then(({ data }) => {
			setSession(data.session);
			setAuthLoading(false);
		});

		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((_event, nextSession) => {
			setSession(nextSession);
			setAuthLoading(false);
		});

		return () => subscription.unsubscribe();
	}, []);

	const signInWithPassword = useCallback(
		async (email: string, password: string) => {
			const { error } = await supabase.auth.signInWithPassword({
				email,
				password,
			});

			if (error) throw error;
		},
		[],
	);

	const signUpWithPassword = useCallback(
		async (email: string, password: string) => {
			const { error } = await supabase.auth.signUp({
				email,
				password,
			});

			if (error) throw error;
		},
		[],
	);

	const signOut = useCallback(async () => {
		const { error } = await supabase.auth.signOut();
		if (error) throw error;
	}, []);

	return (
		<SupabaseContext.Provider
			value={{
				user: session?.user ?? null,
				session,
				authLoading,
				signInWithPassword,
				signUpWithPassword,
				signOut,
			}}
		>
			{children}
		</SupabaseContext.Provider>
	);
}

function useSupabase() {
	const ctx = useContext(SupabaseContext);
	if (!ctx) throw new Error('useSupabase must be used within a SupabaseProvider');
	return ctx;
}

export { SupabaseProvider, useSupabase };
