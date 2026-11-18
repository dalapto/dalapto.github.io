import React, {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from 'react';
import {
	fetchGitHubUser,
	GitHubApiError,
} from '../services/github/github-api';
import type { GitHubUser } from '../types/github.types';
import { ToastSeverity, useToast } from './ToastProvider';

const TOKEN_KEY = 'github_token';

interface GitHubContextValue {
	githubUser: GitHubUser | null;
	githubToken: string | null;
	authLoading: boolean;
	signIn: (token: string) => Promise<void>;
	signOut: () => void;
}

const GitHubContext = createContext<GitHubContextValue | null>(null);

function GitHubProvider({ children }: { children: React.ReactNode }) {
	const [githubUser, setGitHubUser] = useState<GitHubUser | null>(null);
	const [githubToken, setGitHubToken] = useState<string | null>(null);
	const [authLoading, setAuthLoading] = useState(true);
	const { showToast } = useToast();

	// Restore token from localStorage on mount
	useEffect(() => {
		const stored = localStorage.getItem(TOKEN_KEY);
		if (!stored) {
			setAuthLoading(false);
			return;
		}
		setGitHubToken(stored);
		fetchGitHubUser(stored)
			.then(setGitHubUser)
			.catch((error: unknown) => {
				// Only a 401 means the token itself is bad (revoked/expired).
				if (error instanceof GitHubApiError && error.status === 401) {
					localStorage.removeItem(TOKEN_KEY);
					setGitHubToken(null);
					return;
				}
				// Offline, 5xx, rate limit… — keep the token; it may work next time.
				showToast("Couldn't reach GitHub", ToastSeverity.ERROR, error);
			})
			.finally(() => setAuthLoading(false));
	}, [showToast]);

	const signIn = useCallback(async (token: string) => {
		setAuthLoading(true);
		try {
			const user = await fetchGitHubUser(token);
			const expectedLogin = import.meta.env.VITE_GITHUB_USERNAME as string;
			if (
				expectedLogin &&
				user.login.toLowerCase() !== expectedLogin.toLowerCase()
			) {
				throw new Error(
					`This token belongs to @${user.login}, but only @${expectedLogin} is permitted here.`,
				);
			}
			localStorage.setItem(TOKEN_KEY, token);
			setGitHubToken(token);
			setGitHubUser(user);
		} finally {
			setAuthLoading(false);
		}
	}, []);

	const signOut = useCallback(() => {
		setAuthLoading(true);
		localStorage.removeItem(TOKEN_KEY);
		setGitHubToken(null);
		setGitHubUser(null);
		setAuthLoading(false);
	}, []);

	const value = useMemo(
		() => ({ githubUser, githubToken, authLoading, signIn, signOut }),
		[githubUser, githubToken, authLoading, signIn, signOut],
	);

	return <GitHubContext.Provider value={value}>{children}</GitHubContext.Provider>;
}

function useGitHub() {
	const ctx = useContext(GitHubContext);
	if (!ctx) throw new Error('useGitHub must be used within a GitHubProvider');
	return ctx;
}

export { GitHubProvider, useGitHub };
