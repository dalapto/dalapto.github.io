import React, {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react';
import { NavRoute } from '../routes';
import {
	createArticlePageImageObjectUrl,
	fetchPointerGistEntries,
	findPointerGistEntryByFolderName,
	type PointerGistEntry,
} from '../services/github.service';
import {
	getStaticWritingPageImageUrl,
	isPublicWritingFolder,
	writingArticleRoute,
} from '../utils/writing-articles';

interface WritingPagesContextValue {
	entries: Record<string, PointerGistEntry>;
	publicArticles: NavRoute[];
	loading: boolean;
	error: string | null;
	getArticleImageUrl: (folderKey: string) => string | undefined;
	refreshWritingPages: () => Promise<void>;
}

const WritingPagesContext = createContext<WritingPagesContextValue | null>(null);

function buildPublicArticles(
	entries: Record<string, PointerGistEntry>,
): NavRoute[] {
	return Object.entries(entries)
		.filter(([folderKey, entry]) => isPublicWritingFolder(folderKey, entry))
		.map(([folderKey]) => ({
			label: folderKey,
			route: writingArticleRoute(folderKey),
		}))
		.sort((a, b) => (a.label ?? '').localeCompare(b.label ?? ''));
}

function WritingPagesProvider({ children }: { children: React.ReactNode }) {
	const [entries, setEntries] = useState<Record<string, PointerGistEntry>>({});
	const [imageUrls, setImageUrls] = useState<Record<string, string>>({});
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const imageUrlsRef = useRef<Record<string, string>>({});

	const revokeImageUrls = useCallback((urls: Record<string, string>) => {
		for (const url of Object.values(urls)) {
			URL.revokeObjectURL(url);
		}
	}, []);

	const refreshWritingPages = useCallback(async () => {
		try {
			const fetched = await fetchPointerGistEntries();
			const nextUrls: Record<string, string> = {};
			await Promise.all(
				Object.entries(fetched).map(async ([folderKey, entry]) => {
					if (!entry.image?.trim()) return;
					const url = await createArticlePageImageObjectUrl(entry);
					if (url) nextUrls[folderKey] = url;
				}),
			);
			revokeImageUrls(imageUrlsRef.current);
			imageUrlsRef.current = nextUrls;
			setImageUrls(nextUrls);
			setEntries(fetched);
			setError(null);
		} catch (err) {
			setError(
				err instanceof Error ? err.message : 'Failed to load writing pages',
			);
			throw err;
		}
	}, [revokeImageUrls]);

	useEffect(() => {
		let cancelled = false;

		async function load() {
			try {
				await refreshWritingPages();
			} catch {
				// error state set in refreshWritingPages
			} finally {
				if (!cancelled) setLoading(false);
			}
		}

		void load();
		return () => {
			cancelled = true;
		};
	}, [refreshWritingPages]);

	useEffect(
		() => () => {
			revokeImageUrls(imageUrlsRef.current);
			imageUrlsRef.current = {};
		},
		[revokeImageUrls],
	);

	const publicArticles = useMemo(
		() => buildPublicArticles(entries),
		[entries],
	);

	const getArticleImageUrl = useCallback(
		(folderKey: string) => {
			const found = findPointerGistEntryByFolderName(entries, folderKey);
			if (found && imageUrls[found.key]) {
				return imageUrls[found.key];
			}
			return getStaticWritingPageImageUrl(folderKey);
		},
		[entries, imageUrls],
	);

	const value = useMemo(
		() => ({
			entries,
			publicArticles,
			loading,
			error,
			getArticleImageUrl,
			refreshWritingPages,
		}),
		[entries, publicArticles, loading, error, getArticleImageUrl, refreshWritingPages],
	);

	return (
		<WritingPagesContext.Provider value={value}>
			{children}
		</WritingPagesContext.Provider>
	);
}

function useWritingPages(): WritingPagesContextValue {
	const ctx = useContext(WritingPagesContext);
	if (!ctx) {
		throw new Error('useWritingPages must be used within WritingPagesProvider');
	}
	return ctx;
}

export { useWritingPages, WritingPagesProvider };
