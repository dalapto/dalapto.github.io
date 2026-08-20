import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { useBusy } from '../context/BusyContext';
import { useGitHub } from '../context/GitHubContext';
import {
	createArticlePageImageObjectUrl,
	fetchPointerGistEntryByFolderName,
	fetchPointerGistEntryByFolderNameAuth,
} from '../services/github.service';
import {
	ARTICLE_PAGE_IMAGE_FILENAME,
	validateArticlePageImageFile,
} from '../utils/article-page-image';

function usePageImageField(
	articleName: string,
	onValidationError?: (message: string) => void,
) {
	const { githubToken } = useGitHub();
	const { setBusy } = useBusy();
	const busySource = `page-image:${useId()}`;
	const [committedImageFilename, setCommittedImageFilename] = useState<
		string | null
	>(null);
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);
	const [pendingFile, setPendingFile] = useState<File | null>(null);
	const [removed, setRemoved] = useState(false);
	const [loading, setLoading] = useState(false);
	const objectUrlRef = useRef<string | null>(null);

	const revokeObjectUrl = useCallback(() => {
		if (objectUrlRef.current) {
			URL.revokeObjectURL(objectUrlRef.current);
			objectUrlRef.current = null;
		}
	}, []);

	useEffect(() => {
		const trimmed = articleName.trim();
		if (!trimmed) {
			revokeObjectUrl();
			setCommittedImageFilename(null);
			setPreviewUrl(null);
			setPendingFile(null);
			setRemoved(false);
			setLoading(false);
			setBusy(false, { source: busySource });
			return;
		}

		let cancelled = false;
		setLoading(true);
		setBusy(true, {
			label: 'page image',
			variant: 'spinner',
			operation: 'fetch',
			source: busySource,
		});

		async function load() {
			try {
				const entry = githubToken
					? await fetchPointerGistEntryByFolderNameAuth(githubToken, trimmed)
					: await fetchPointerGistEntryByFolderName(trimmed);
				if (cancelled) return;
				revokeObjectUrl();
				setPendingFile(null);
				setRemoved(false);
				const filename = entry?.image?.trim() ?? null;
				setCommittedImageFilename(filename);
				if (!entry?.image) {
					setPreviewUrl(null);
					return;
				}
				const url = await createArticlePageImageObjectUrl(
					entry,
					githubToken ?? undefined,
				);
				if (cancelled) {
					if (url) URL.revokeObjectURL(url);
					return;
				}
				objectUrlRef.current = url ?? null;
				setPreviewUrl(url ?? null);
			} catch {
				if (!cancelled) {
					revokeObjectUrl();
					setCommittedImageFilename(null);
					setPreviewUrl(null);
					setPendingFile(null);
					setRemoved(false);
				}
			} finally {
				if (!cancelled) {
					setLoading(false);
					setBusy(false, { source: busySource });
				}
			}
		}

		void load();
		return () => {
			cancelled = true;
			setBusy(false, { source: busySource });
		};
	}, [articleName, busySource, githubToken, revokeObjectUrl, setBusy]);

	useEffect(() => () => revokeObjectUrl(), [revokeObjectUrl]);

	const handleFileSelect = useCallback(
		(file: File) => {
			const validationError = validateArticlePageImageFile(file);
			if (validationError) {
				onValidationError?.(validationError);
				return;
			}
			revokeObjectUrl();
			const url = URL.createObjectURL(file);
			objectUrlRef.current = url;
			setPendingFile(file);
			setRemoved(false);
			setPreviewUrl(url);
		},
		[onValidationError, revokeObjectUrl],
	);

	const handleRemove = useCallback(() => {
		revokeObjectUrl();
		setPendingFile(null);
		setRemoved(true);
		setPreviewUrl(null);
	}, [revokeObjectUrl]);

	const hasImageChanges =
		pendingFile !== null || (removed && committedImageFilename !== null);

	const resetAfterSave = useCallback(() => {
		if (pendingFile) {
			setCommittedImageFilename(ARTICLE_PAGE_IMAGE_FILENAME);
			setPendingFile(null);
			setRemoved(false);
			return;
		}
		if (removed) {
			revokeObjectUrl();
			setCommittedImageFilename(null);
			setPreviewUrl(null);
			setRemoved(false);
			setPendingFile(null);
		}
	}, [pendingFile, removed, revokeObjectUrl]);

	return {
		previewUrl,
		pendingFile,
		removed,
		loading,
		hasImageChanges,
		handleFileSelect,
		handleRemove,
		resetAfterSave,
	};
}

export { usePageImageField };
