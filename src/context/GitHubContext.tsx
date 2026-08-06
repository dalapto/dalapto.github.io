import React, {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from 'react';
import { fetchGitHubUser } from '../services/github.service';
import type { GitHubUser } from '../types/github.types';

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
			.catch(() => {
				localStorage.removeItem(TOKEN_KEY);
				setGitHubToken(null);
			})
			.finally(() => setAuthLoading(false));
	}, []);

	const signIn = useCallback(async (token: string) => {
		const user = await fetchGitHubUser(token);
		const expectedLogin = import.meta.env.VITE_GITHUB_USERNAME as string;
		if (expectedLogin && user.login.toLowerCase() !== expectedLogin.toLowerCase()) {
			throw new Error(
				`This token belongs to @${user.login}, but only @${expectedLogin} is permitted here.`,
			);
		}
		localStorage.setItem(TOKEN_KEY, token);
		setGitHubToken(token);
		setGitHubUser(user);
	}, []);

	const signOut = useCallback(() => {
		localStorage.removeItem(TOKEN_KEY);
		setGitHubToken(null);
		setGitHubUser(null);
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
