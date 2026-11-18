import { useCallback, useEffect, useRef, useState } from 'react';
import {
	fetchPointerGistEntryByFolderName,
	fetchPointerGistEntryByFolderNameAuth,
} from '../services/github/pointer-gist.service';
import { logErrorDetails } from '../utils/getErrorMessage';
import { isStaticWritingFolderKey } from '../utils/writing-articles';

/**
 * - `known`: visibility loaded (or nothing to load) — safe to save
 * - `loading` / `error`: visibility unknown — saving would risk overwriting it
 */
type HiddenStatus = 'loading' | 'known' | 'error';

interface UsePointerGistHiddenOptions {
	token: string | null;
	/** Skip the lookup (e.g. a brand-new article with no pointer entry yet). */
	skip?: boolean;
	onError?: (message: string) => void;
}

/**
 * Loads an article's `hidden` flag from the pointer gist.
 *
 * Never guesses: if the read fails, the flag is left untouched and `status`
 * becomes `'error'`, so callers can block saves that would write `hidden`
 * (previously a failed read silently unpublished the article on next save).
 */
function usePointerGistHidden(
	articleName: string,
	{ token, skip = false, onError }: UsePointerGistHiddenOptions,
) {
	const [isHidden, setIsHidden] = useState(true);
	const [committedIsHidden, setCommittedIsHidden] = useState(true);
	const [status, setStatus] = useState<HiddenStatus>('known');
	const [retryKey, setRetryKey] = useState(0);

	const onErrorRef = useRef(onError);
	onErrorRef.current = onError;

	const name = articleName.trim();

	useEffect(() => {
		if (!name) {
			setIsHidden(true);
			setCommittedIsHidden(true);
			setStatus('known');
			return;
		}
		if (skip || isStaticWritingFolderKey(name)) {
			setStatus('known');
			return;
		}

		let cancelled = false;
		setStatus('loading');

		const request = token
			? fetchPointerGistEntryByFolderNameAuth(token, name)
			: fetchPointerGistEntryByFolderName(name);

		request
			.then((entry) => {
				if (cancelled) return;
				// No pointer entry → the article isn't published, so it's hidden.
				const hidden = entry?.hidden ?? true;
				setIsHidden(hidden);
				setCommittedIsHidden(hidden);
				setStatus('known');
			})
			.catch((error: unknown) => {
				if (cancelled) return;
				logErrorDetails(error, 'Load article visibility');
				setStatus('error');
				onErrorRef.current?.(
					"Couldn't load this article's visibility. Saving is paused so it isn't unpublished by mistake.",
				);
			});

		return () => {
			cancelled = true;
		};
	}, [name, token, skip, retryKey]);

	const retry = useCallback(() => setRetryKey((n) => n + 1), []);
	const markCommitted = useCallback((hidden: boolean) => {
		setCommittedIsHidden(hidden);
	}, []);

	return {
		isHidden,
		setIsHidden,
		committedIsHidden,
		markCommitted,
		status,
		visibilityUnknown: status !== 'known',
		retry,
	};
}

export { usePointerGistHidden };
export type { HiddenStatus };
