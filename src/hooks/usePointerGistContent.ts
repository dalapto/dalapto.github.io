import { useEffect, useState } from 'react';
import { useBusy } from '../context/BusyContext';
import {
	fetchPointerGistEntries,
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
	const { setBusy } = useBusy();
	const [files, setFiles] = useState<PointerGistFile[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let cancelled = false;
		setBusy(true, { label: 'content', operation: 'fetch' });

		async function load() {
			try {
				const entries = await fetchPointerGistEntries();
				const entry = entries[pageKey];
				if (!entry) {
					if (!cancelled) setError(`No gist registered for "${pageKey}"`);
					return;
				}
				const fetched = await fetchPublicGistFiles(entry.id, entry.files);
				if (!cancelled) setFiles(fetched);
			} catch (err) {
				if (!cancelled)
					setError(
						err instanceof Error ? err.message : 'Failed to load content',
					);
			} finally {
				if (!cancelled) setLoading(false);
				setBusy(false);
			}
		}

		void load();
		return () => {
			cancelled = true;
		};
	}, [pageKey, setBusy]);

	return { files, loading, error };
}

export { usePointerGistContent };
export type { PointerGistFile, UsePointerGistContentResult };
