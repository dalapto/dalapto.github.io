import { useCallback } from 'react';
import { useAuthRequest } from '../../../context/AuthRequestContext';
import { useGitHub } from '../../../context/GitHubContext';
import {
	type ToastContextValue,
	ToastSeverity,
} from '../../../context/ToastProvider';
import { useBusyTask } from '../../../hooks/useBusyTask';
import { usePageImageField } from '../../../hooks/usePageImageField';
import { uploadArticlePageImage } from '../../../services/github/articles.service';
import { commitArticleToPointer } from '../../../services/github/pointer-gist.service';
import type { Folder } from '../../../types/github.types';
import { parseOrderInput } from '../../../utils/pointer-gist-articles';
import { isStaticWritingFolderKey } from '../../../utils/writing-articles';

interface UseArticleSaveOptions {
	/** Article whose page image is shown and edited ('' for none). */
	imageArticleName: string;
	isHidden: boolean;
	/** True while the stored hidden flag is loading or failed — never save then. */
	visibilityUnknown: boolean;
	/** Edit only: records the saved hidden value as the new baseline. */
	markHiddenCommitted?: (hidden: boolean) => void;
	onSaved: () => void | Promise<void>;
	showToast: ToastContextValue['showToast'];
}

interface ArticleCommitInput {
	gistId: string;
	articleName: string;
	/** Section file saved, for applying the Order field. */
	filename?: string;
	/** Raw Order field value. */
	order?: string;
	/** A section renamed within the same gist (keeps its order). */
	rename?: { from: string; to: string };
}

/**
 * Everything the Create and Edit note panels share around saving an article:
 * the page-image field, uploading its change, the single Writing-index commit
 * (hidden, order, rename, image) and the "save page image only" flow.
 */
function useArticleSave({
	imageArticleName,
	isHidden,
	visibilityUnknown,
	markHiddenCommitted,
	onSaved,
	showToast,
}: UseArticleSaveOptions) {
	const { githubToken } = useGitHub();
	const { requestAuth } = useAuthRequest();
	const runBusyTask = useBusyTask(showToast);

	const showImageControl =
		imageArticleName.trim() !== '' && !isStaticWritingFolderKey(imageArticleName);
	const pageImage = usePageImageField(
		showImageControl ? imageArticleName : '',
		(message) => showToast(message, ToastSeverity.ERROR),
	);
	const {
		hasImageChanges,
		pendingFile,
		removed,
		resetAfterSave: resetPageImageAfterSave,
	} = pageImage;

	/** Uploads the page-image file change (if any); the index is updated by the commit. */
	const uploadPageImage = useCallback(
		async (token: string, gistId: string, articleName: string) => {
			if (!hasImageChanges || isStaticWritingFolderKey(articleName)) {
				return undefined;
			}
			return uploadArticlePageImage(token, gistId, {
				file: pendingFile ?? undefined,
				remove: removed && !pendingFile,
			});
		},
		[hasImageChanges, pendingFile, removed],
	);

	/** Uploads the page image (if changed), then records the save with ONE index write. */
	const commitArticle = useCallback(
		async (token: string, input: ArticleCommitInput) => {
			const { gistId, articleName, filename, order = '', rename } = input;
			const imageChange = await uploadPageImage(token, gistId, articleName);
			const parsedOrder = filename ? parseOrderInput(order) : undefined;
			await commitArticleToPointer(token, {
				gistId,
				folderName: articleName,
				hidden: isHidden,
				orderUpdates:
					filename && parsedOrder !== undefined
						? [{ name: filename, order: parsedOrder }]
						: [],
				rename,
				imageChange,
			});
		},
		[isHidden, uploadPageImage],
	);

	/** Resets the image field and hidden baseline after a successful commit. */
	const markSaved = useCallback(() => {
		markHiddenCommitted?.(isHidden);
		resetPageImageAfterSave();
	}, [isHidden, markHiddenCommitted, resetPageImageAfterSave]);

	/** Saves only the page image (and hidden flag) of an existing article. */
	const saveImageOnly = useCallback(
		async (folder: Folder) => {
			// Never write `hidden` while it's unknown — that could unpublish the article.
			if (visibilityUnknown || !hasImageChanges) return;
			if (!githubToken) {
				requestAuth();
				return;
			}
			await runBusyTask(
				{ label: 'page image', variant: 'progress', operation: 'save' },
				async () => {
					await commitArticle(githubToken, {
						gistId: folder.id,
						articleName: folder.name.trim(),
					});
					showToast('Page image saved.', ToastSeverity.SUCCESS);
					markSaved();
					await onSaved();
				},
			);
		},
		[
			commitArticle,
			githubToken,
			hasImageChanges,
			markSaved,
			onSaved,
			requestAuth,
			runBusyTask,
			showToast,
			visibilityUnknown,
		],
	);

	return {
		pageImage,
		showImageControl,
		commitArticle,
		markSaved,
		saveImageOnly,
		runBusyTask,
	};
}

export { useArticleSave };
