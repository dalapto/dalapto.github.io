import { useEffect, useState } from 'react';
import {
	fetchPointerGistIds,
	fetchPublicGistFiles,
} from '../services/github.service';

interface PointerGistFile {
	filename: string;
	content: string;
}

interface UsePointerGistContentResult {
	files: PointerGistFile[];
	loading: boolean;
	error: string | null;
}

function usePointerGistContent(pageKey: string): UsePointerGistContentResult {
	const [files, setFiles] = useState<PointerGistFile[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let cancelled = false;

		async function load() {
			try {
				const ids = await fetchPointerGistIds();
				const gistId = ids[pageKey];
				if (!gistId) {
					if (!cancelled) setError(`No gist registered for "${pageKey}"`);
					return;
				}
				const fetched = await fetchPublicGistFiles(gistId);
				if (!cancelled) setFiles(fetched);
			} catch (err) {
				if (!cancelled)
					setError(err instanceof Error ? err.message : 'Failed to load content');
			} finally {
				if (!cancelled) setLoading(false);
			}
		}

		void load();
		return () => {
			cancelled = true;
		};
	}, [pageKey]);

	return { files, loading, error };
}

export { usePointerGistContent };
export type { PointerGistFile, UsePointerGistContentResult };
