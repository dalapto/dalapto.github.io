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
} from '../services/github/articles.service';
import {
	fetchPointerGistEntries,
	findPointerGistEntryByFolderName,
	type PointerGistEntry,
} from '../services/github/pointer-gist.service';
import {
	getStaticWritingPageImageUrl,
	isPublicWritingFolder,
	writingArticleRoute,
} from '../utils/writing-articles';
import { logErrorDetails } from '../utils/getErrorMessage';

interface WritingPagesContextValue {
	entries: Record<string, PointerGistEntry>;
	publicArticles: NavRoute[];
	loading: boolean;
	error: string | null;
	getArticleImageUrl: (folderKey: string) => string | undefined;
	/** Start loading article page images. Call from pages that show them. */
	requestArticleImages: () => void;
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
	const entriesRef = useRef<Record<string, PointerGistEntry> | null>(null);
	// Only the newest refresh may commit; an older, slower one is ignored.
	const latestRefresh = useRef(0);
	// Images are only downloaded once a page that shows them asks for them.
	const imagesWanted = useRef(false);
	const imagesLoadedFor = useRef(-1);

	/** Load page images for one refresh's entries, committing each as it arrives. */
	const loadArticleImages = useCallback(
		(fetched: Record<string, PointerGistEntry>, refreshId: number) => {
			if (imagesLoadedFor.current === refreshId) return;
			imagesLoadedFor.current = refreshId;

			// Drop images for articles that are gone or no longer have one.
			const kept: Record<string, string> = {};
			for (const [key, url] of Object.entries(imageUrlsRef.current)) {
				if (fetched[key]?.image?.trim()) kept[key] = url;
				else URL.revokeObjectURL(url);
			}
			imageUrlsRef.current = kept;
			setImageUrls(kept);

			for (const [folderKey, entry] of Object.entries(fetched)) {
				if (!entry.image?.trim()) continue;
				void createArticlePageImageObjectUrl(entry).then((url) => {
					if (!url) return;
					if (refreshId !== latestRefresh.current) {
						URL.revokeObjectURL(url);
						return;
					}
					const previous = imageUrlsRef.current[folderKey];
					imageUrlsRef.current = { ...imageUrlsRef.current, [folderKey]: url };
					setImageUrls(imageUrlsRef.current);
					if (previous) URL.revokeObjectURL(previous);
				});
			}
		},
		[],
	);

	const refreshWritingPages = useCallback(async () => {
		const refreshId = ++latestRefresh.current;
		try {
			const fetched = await fetchPointerGistEntries();
			if (refreshId !== latestRefresh.current) return;
			entriesRef.current = fetched;
			setEntries(fetched);
			setError(null);
			if (imagesWanted.current) loadArticleImages(fetched, refreshId);
		} catch (err) {
			if (refreshId !== latestRefresh.current) return;
			logErrorDetails(err, 'Load Writing index');
			setError(
				err instanceof Error ? err.message : 'Failed to load writing pages',
			);
			throw err;
		}
	}, [loadArticleImages]);

	const requestArticleImages = useCallback(() => {
		imagesWanted.current = true;
		if (entriesRef.current) {
			loadArticleImages(entriesRef.current, latestRefresh.current);
		}
	}, [loadArticleImages]);

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
			for (const url of Object.values(imageUrlsRef.current)) {
				URL.revokeObjectURL(url);
			}
			imageUrlsRef.current = {};
		},
		[],
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
			requestArticleImages,
			refreshWritingPages,
		}),
		[
			entries,
			publicArticles,
			loading,
			error,
			getArticleImageUrl,
			requestArticleImages,
			refreshWritingPages,
		],
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
