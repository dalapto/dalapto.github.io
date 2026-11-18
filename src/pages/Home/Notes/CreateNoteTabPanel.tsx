import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import { Box } from '@mui/material';
import { useCallback, useMemo, useState } from 'react';
import { PageImageField } from '../../../components/controls/PageImageField/PageImageField';
import { StandardAutocomplete } from '../../../components/controls/StandardAutocomplete/StandardAutocomplete';
import { StandardTextArea } from '../../../components/controls/StandardTextArea/StandardTextArea';
import { StandardTextField } from '../../../components/controls/StandardTextField/StandardTextField';
import {
	ActionToolbar,
	FormPanel,
} from '../../../components/layout/FormPanel/FormPanel';
import { useAuthRequest } from '../../../context/AuthRequestContext';
import { useBusy } from '../../../context/BusyContext';
import { useGitHub } from '../../../context/GitHubContext';
import { ToastSeverity } from '../../../context/ToastProvider';
import { useUnsavedChanges } from '../../../context/UnsavedChangesContext';
import { useTextClipboard } from '../../../hooks/useTextClipboard';
import { usePageImageField } from '../../../hooks/usePageImageField';
import { usePointerGistHidden } from '../../../hooks/usePointerGistHidden';
import { uploadArticlePageImage } from '../../../services/github/articles.service';
import { saveNote } from '../../../services/github/notes.service';
import {
	commitArticleToPointer,
	isPointerGistFolder,
} from '../../../services/github/pointer-gist.service';
import type { ActionConfig } from '../../../types/basic.types';
import type { Folder } from '../../../types/github.types';
import { filterArticleTextFilenames } from '../../../utils/article-page-image';
import { getErrorMessage } from '../../../utils/getErrorMessage';
import {
	clampOrderInput,
	parseOrderInput,
} from '../../../utils/pointer-gist-articles';
import { isStaticWritingFolderKey } from '../../../utils/writing-articles';
import { HiddenCheckbox } from './HiddenCheckbox';

type NoteField = 'order' | 'section' | 'article' | 'text';

const emptyTouched = { order: false, section: false, article: false, text: false };

interface CreateNoteTabPanelProps {
	folders: Folder[];
	onSaved: () => void | Promise<void>;
	showToast: (
		message: string,
		severity: ToastSeverity,
		error?: unknown,
	) => void;
}

function CreateNoteTabPanel({
	folders,
	onSaved,
	showToast,
}: CreateNoteTabPanelProps) {
	const { githubToken } = useGitHub();
	const { requestAuth } = useAuthRequest();
	const [section, setSection] = useState('');
	const [order, setOrder] = useState('');
	const [text, setText] = useState('');
	const [article, setArticle] = useState('');
	const { busy, operation, setBusy } = useBusy();
	const [touched, setTouched] = useState(emptyTouched);

	const { copy, paste } = useTextClipboard(text, setText);
	const showPageImageControl =
		article.trim() !== '' && !isStaticWritingFolderKey(article);
	const {
		previewUrl: pageImageUrl,
		pendingFile: pendingPageImageFile,
		removed: pageImageRemoved,
		hasImageChanges: hasPageImageChanges,
		handleFileSelect: handlePageImageSelect,
		handleRemove: handlePageImageRemove,
		resetAfterSave: resetPageImageAfterSave,
		loading: pageImageLoading,
	} = usePageImageField(showPageImageControl ? article : '', (message) =>
		showToast(message, ToastSeverity.ERROR),
	);

	const isNewArticle =
		article.trim() !== '' &&
		!folders.some(
			(item) => item.name.toLowerCase() === article.trim().toLowerCase(),
		);

	const {
		isHidden,
		setIsHidden,
		status: hiddenStatus,
		visibilityUnknown,
		retry: retryHiddenLoad,
	} = usePointerGistHidden(article, {
		token: githubToken,
		skip: isNewArticle,
		onError: (message) => showToast(message, ToastSeverity.WARNING),
	});

	const markTouched = useCallback((field: NoteField) => {
		setTouched((prev) => (prev[field] ? prev : { ...prev, [field]: true }));
	}, []);

	const articleOptions = useMemo(() => {
		const names = folders
			.filter((item) => !isPointerGistFolder(item))
			.map((item) => item.name.trim())
			.filter(Boolean);
		return [...new Set(names)];
	}, [folders]);

	const handleArticleChange = useCallback((value: string) => {
		setArticle(value);
	}, []);

	const handleArticleOpen = useCallback(() => {
		if (!githubToken) {
			requestAuth();
		}
	}, [githubToken, requestAuth]);

	const noteFilename = section.trim() ? `${section.trim()}.txt` : '';
	const selectedArticle = folders.find(
		(item) => item.name.toLowerCase() === article.trim().toLowerCase(),
	);
	const isDuplicateNote =
		noteFilename !== '' &&
		(selectedArticle
			? filterArticleTextFilenames(selectedArticle.noteFilenames).some(
				(name) => name.toLowerCase() === noteFilename.toLowerCase(),
			)
			: false);

	const canSaveNote =
		!!section.trim() &&
		!!text.trim() &&
		!!article.trim() &&
		!isDuplicateNote &&
		!visibilityUnknown;
	const canSaveImageOnly =
		showPageImageControl &&
		!!selectedArticle &&
		hasPageImageChanges &&
		!isNewArticle &&
		!visibilityUnknown;

	const hasUnsavedChanges =
		!!section.trim() || !!text.trim() || hasPageImageChanges;
	useUnsavedChanges(hasUnsavedChanges, 'Notes (Create)');

	/** Uploads the page-image file change (if any); the index is updated by the commit. */
	const uploadPageImage = useCallback(
		async (folderId: string, articleName: string) => {
			if (!hasPageImageChanges || isStaticWritingFolderKey(articleName)) {
				return undefined;
			}
			return uploadArticlePageImage(githubToken!, folderId, {
				file: pendingPageImageFile ?? undefined,
				remove: pageImageRemoved && !pendingPageImageFile,
			});
		},
		[
			githubToken,
			hasPageImageChanges,
			pageImageRemoved,
			pendingPageImageFile,
		],
	);

	const performSaveImageOnly = useCallback(async () => {
		if (!githubToken) {
			requestAuth();
			return;
		}
		if (!selectedArticle || !canSaveImageOnly) return;

		const articleName = selectedArticle.name;
		setBusy(true, {
			label: 'page image',
			variant: 'progress',
			operation: 'save',
		});
		try {
			const imageChange = await uploadPageImage(selectedArticle.id, articleName);
			await commitArticleToPointer(githubToken, {
				gistId: selectedArticle.id,
				folderName: articleName,
				hidden: isHidden,
				imageChange,
			});
			showToast('Page image saved.', ToastSeverity.SUCCESS);
			resetPageImageAfterSave();
			onSaved();
		} catch (error) {
			console.error(error);
			showToast(getErrorMessage(error), ToastSeverity.ERROR, error);
		} finally {
			setBusy(false);
		}
	}, [
		canSaveImageOnly,
		githubToken,
		isHidden,
		onSaved,
		requestAuth,
		resetPageImageAfterSave,
		selectedArticle,
		setBusy,
		showToast,
		uploadPageImage,
	]);

	const performSave = useCallback(async () => {
		// Never write `hidden` while it's unknown — that could unpublish the article.
		if (visibilityUnknown) return;
		if (!githubToken) {
			requestAuth();
			return;
		}

		const articleName = article.trim();
		const filename = `${section.trim()}.txt`;

		setBusy(true, {
			label: section.trim(),
			variant: 'progress',
			operation: 'save',
		});
		try {
			const saved = await saveNote(githubToken, {
				folder: articleName,
				filename,
				content: text,
			});
			const imageChange = await uploadPageImage(saved.folderId, articleName);
			const parsedOrder = parseOrderInput(order);
			await commitArticleToPointer(githubToken, {
				gistId: saved.folderId,
				folderName: articleName,
				hidden: isHidden,
				orderUpdates:
					parsedOrder === undefined
						? []
						: [{ name: filename, order: parsedOrder }],
				imageChange,
			});
			showToast(`Created ${section.trim()} successfully.`, ToastSeverity.SUCCESS);
			setSection('');
			setOrder('');
			setText('');
			setArticle('');
			setIsHidden(true);
			setTouched(emptyTouched);
			resetPageImageAfterSave();
			onSaved();
		} catch (error) {
			console.error(error);
			showToast(getErrorMessage(error), ToastSeverity.ERROR, error);
		} finally {
			setBusy(false);
		}
	}, [
		article,
		githubToken,
		isHidden,
		onSaved,
		order,
		requestAuth,
		resetPageImageAfterSave,
		section,
		setBusy,
		setIsHidden,
		showToast,
		text,
		uploadPageImage,
		visibilityUnknown,
	]);

	function handleSave() {
		if (canSaveImageOnly && !canSaveNote) {
			void performSaveImageOnly();
			return;
		}
		void performSave();
	}

	function handleClearText() {
		setText('');
	}

	const sectionRequiredError = touched.section && !section.trim();
	const articleRequiredError = touched.article && !article.trim();
	const textRequiredError = touched.text && !text.trim();

	const sectionError = isDuplicateNote || sectionRequiredError;
	const sectionHelperText = isDuplicateNote
		? 'This note already exists in this article.'
		: sectionRequiredError
			? 'Section is required.'
			: undefined;

	const articleError = articleRequiredError;
	const articleHelperText = articleRequiredError
		? 'Article is required.'
		: isNewArticle
			? 'New article will be created.'
			: undefined;

	const textHelperText = textRequiredError
		? 'Note text is required.'
		: undefined;

	const textToolbarActions: ActionConfig[] = [
		{
			id: 'copy',
			label: 'Copy',
			variant: 'outlined',
			icon: <ContentCopyIcon />,
			onClick: () => void copy(),
			disabled: !text.trim(),
		},
		{
			id: 'paste',
			label: 'Paste',
			variant: 'contained',
			icon: <ContentPasteIcon />,
			onClick: () => void paste(),
			mobileIconOnly: false,
		},
	];

	const footerActions: ActionConfig[] = [
		{
			id: 'clear',
			label: 'Clear',
			variant: 'outlined',
			onClick: handleClearText,
			hidden: !text.trim(),
		},
		{
			id: 'save',
			label: busy && operation === 'save' ? 'Saving…' : 'Save',
			variant: 'contained',
			onClick: handleSave,
			disabled:
				(busy && operation === 'save') ||
				(!canSaveNote && !canSaveImageOnly),
		},
	];

	return (
		<FormPanel
			footerActions={footerActions}
			sx={{
				minWidth: { xs: '80vw', sm: '50vw' },
				maxWidth: { xs: '80vw', sm: '50vw' },
			}}
		>
			<Box
				sx={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0 }}
			>
				<StandardAutocomplete
					id='note-article'
					label='Article'
					value={article}
					onChange={handleArticleChange}
					onOpen={handleArticleOpen}
					onBlur={() => markTouched('article')}
					options={articleOptions}
					error={articleError}
					helperText={articleHelperText}
					sx={{ minWidth: 0, width: { xs: '100%', sm: '50%' } }}
					required
				/>
				{showPageImageControl && (
					<PageImageField
						imageUrl={pageImageUrl}
						onFileSelect={handlePageImageSelect}
						onRemove={handlePageImageRemove}
						disabled={pageImageLoading || (busy && operation === 'save')}
					/>
				)}
				<Box
					sx={{
						display: 'flex',
						flexDirection: { xs: 'column', sm: 'row' },
						gap: 1.5,
						minWidth: 0,
						width: { xs: '100%', sm: '50%' },
						alignItems: { xs: 'stretch', sm: 'flex-start' },
					}}
				>
					<StandardTextField
						id='note-order'
						label='Order'
						value={order}
						onChange={(e) => setOrder(clampOrderInput(e.target.value))}
						onBlur={() => markTouched('order')}
						inputProps={{
							inputMode: 'numeric',
							pattern: '[0-9]*',
							maxLength: 3,
						}}
						sx={{
							flexShrink: 0,
							width: { xs: '100%', sm: '4.5rem' },
							minWidth: 0,
						}}
						size='small'
					/>
					<StandardTextField
						id='note-section'
						label='Section'
						value={section}
						onChange={(e) => setSection(e.target.value)}
						onBlur={() => markTouched('section')}
						sx={{ flex: { sm: 1 }, minWidth: 0, width: '100%' }}
						size='small'
						required
						error={sectionError}
						helperText={sectionHelperText}
					/>
					<Box
						sx={{
							position: 'relative',
							flexShrink: 0,
							alignSelf: 'flex-start',
						}}
					>
						<HiddenCheckbox
							checked={isHidden}
							onChange={setIsHidden}
							status={hiddenStatus}
							onRetry={retryHiddenLoad}
						/>
					</Box>
				</Box>
			</Box>
			<ActionToolbar
				actions={{ end: textToolbarActions }}
				sx={{ justifyContent: 'flex-end', mt: 1 }}
			/>
			<StandardTextArea
				id='note-text'
				name='note-text'
				placeholder='What do you want to write down?'
				value={text}
				onChange={setText}
				onBlur={() => markTouched('text')}
				error={textRequiredError}
				helperText={textHelperText}
				required
			/>
		</FormPanel>
	);
}

export { CreateNoteTabPanel };
