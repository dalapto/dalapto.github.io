import { Box } from '@mui/material';
import { useCallback, useMemo, useState } from 'react';
import { PageImageField } from '../../../components/controls/PageImageField/PageImageField';
import { StandardAutocomplete } from '../../../components/controls/StandardAutocomplete/StandardAutocomplete';
import { FormPanel } from '../../../components/layout/FormPanel/FormPanel';
import { useAuthRequest } from '../../../context/AuthRequestContext';
import { useBusy } from '../../../context/BusyContext';
import { useGitHub } from '../../../context/GitHubContext';
import {
	type ToastContextValue,
	ToastSeverity,
} from '../../../context/ToastProvider';
import { useUnsavedChanges } from '../../../context/UnsavedChangesContext';
import { usePointerGistHidden } from '../../../hooks/usePointerGistHidden';
import { saveNote } from '../../../services/github/notes.service';
import type { ActionConfig } from '../../../types/basic.types';
import type { Folder } from '../../../types/github.types';
import {
	findFolderByName,
	getArticleOptions,
	sectionExists,
	sectionFilename,
} from './note-form-helpers';
import { NoteTextEditor } from './NoteTextEditor';
import { SectionFields } from './SectionFields';
import { useArticleSave } from './useArticleSave';

type NoteField = 'order' | 'section' | 'article' | 'text';

const emptyTouched = { order: false, section: false, article: false, text: false };

interface CreateNoteTabPanelProps {
	folders: Folder[];
	onSaved: () => void | Promise<void>;
	showToast: ToastContextValue['showToast'];
}

function CreateNoteTabPanel({
	folders,
	onSaved,
	showToast,
}: CreateNoteTabPanelProps) {
	const { githubToken } = useGitHub();
	const { requestAuth } = useAuthRequest();
	const { busy, operation } = useBusy();
	const [section, setSection] = useState('');
	const [order, setOrder] = useState('');
	const [text, setText] = useState('');
	const [article, setArticle] = useState('');
	const [touched, setTouched] = useState(emptyTouched);

	const articleOptions = useMemo(() => getArticleOptions(folders), [folders]);
	const selectedArticle = findFolderByName(folders, article);
	const isNewArticle = article.trim() !== '' && !selectedArticle;
	const noteFilename = sectionFilename(section);
	const isDuplicateNote = sectionExists(selectedArticle, noteFilename);

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

	const {
		pageImage,
		showImageControl,
		commitArticle,
		markSaved,
		saveImageOnly,
		runBusyTask,
	} = useArticleSave({
		imageArticleName: article,
		isHidden,
		visibilityUnknown,
		onSaved,
		showToast,
	});

	const markTouched = useCallback((field: NoteField) => {
		setTouched((prev) => (prev[field] ? prev : { ...prev, [field]: true }));
	}, []);

	const handleArticleOpen = useCallback(() => {
		if (!githubToken) requestAuth();
	}, [githubToken, requestAuth]);

	const canSaveNote =
		!!section.trim() &&
		!!text.trim() &&
		!!article.trim() &&
		!isDuplicateNote &&
		!visibilityUnknown;
	const canSaveImageOnly =
		showImageControl &&
		!!selectedArticle &&
		pageImage.hasImageChanges &&
		!visibilityUnknown;

	const hasUnsavedChanges =
		!!section.trim() || !!text.trim() || pageImage.hasImageChanges;
	useUnsavedChanges(hasUnsavedChanges, 'Notes (Create)');

	const performSave = useCallback(async () => {
		// Never write `hidden` while it's unknown — that could unpublish the article.
		if (visibilityUnknown) return;
		if (!githubToken) {
			requestAuth();
			return;
		}

		const articleName = article.trim();
		const trimmedSection = section.trim();
		const filename = sectionFilename(section);

		await runBusyTask(
			{ label: trimmedSection, variant: 'progress', operation: 'save' },
			async () => {
				const saved = await saveNote(githubToken, {
					folder: articleName,
					filename,
					content: text,
				});
				await commitArticle(githubToken, {
					gistId: saved.folderId,
					articleName,
					filename,
					order,
				});
				showToast(`Created ${trimmedSection} successfully.`, ToastSeverity.SUCCESS);
				setSection('');
				setOrder('');
				setText('');
				setArticle('');
				setIsHidden(true);
				setTouched(emptyTouched);
				markSaved();
				await onSaved();
			},
		);
	}, [
		article,
		commitArticle,
		githubToken,
		markSaved,
		onSaved,
		order,
		requestAuth,
		runBusyTask,
		section,
		setIsHidden,
		showToast,
		text,
		visibilityUnknown,
	]);

	function handleSave() {
		if (canSaveImageOnly && !canSaveNote && selectedArticle) {
			void saveImageOnly(selectedArticle);
			return;
		}
		void performSave();
	}

	const sectionRequiredError = touched.section && !section.trim();
	const articleRequiredError = touched.article && !article.trim();
	const textRequiredError = touched.text && !text.trim();

	const sectionHelperText = isDuplicateNote
		? 'This note already exists in this article.'
		: sectionRequiredError
			? 'Section is required.'
			: undefined;

	const articleHelperText = articleRequiredError
		? 'Article is required.'
		: isNewArticle
			? 'New article will be created.'
			: undefined;

	const footerActions: ActionConfig[] = [
		{
			id: 'clear',
			label: 'Clear',
			variant: 'outlined',
			onClick: () => setText(''),
			hidden: !text.trim(),
		},
		{
			id: 'save',
			label: busy && operation === 'save' ? 'Saving…' : 'Save',
			variant: 'contained',
			onClick: handleSave,
			disabled:
				(busy && operation === 'save') || (!canSaveNote && !canSaveImageOnly),
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
					onChange={setArticle}
					onOpen={handleArticleOpen}
					onBlur={() => markTouched('article')}
					options={articleOptions}
					error={articleRequiredError}
					helperText={articleHelperText}
					sx={{ minWidth: 0, width: { xs: '100%', sm: '50%' } }}
					required
				/>
				{showImageControl && (
					<PageImageField
						imageUrl={pageImage.previewUrl}
						onFileSelect={pageImage.handleFileSelect}
						onRemove={pageImage.handleRemove}
						disabled={pageImage.loading || (busy && operation === 'save')}
					/>
				)}
				<SectionFields
					idPrefix='note'
					order={order}
					onOrderChange={setOrder}
					onOrderBlur={() => markTouched('order')}
					section={section}
					onSectionChange={setSection}
					onSectionBlur={() => markTouched('section')}
					sectionError={isDuplicateNote || sectionRequiredError}
					sectionHelperText={sectionHelperText}
					isHidden={isHidden}
					onHiddenChange={setIsHidden}
					hiddenStatus={hiddenStatus}
					onHiddenRetry={retryHiddenLoad}
				/>
			</Box>
			<NoteTextEditor
				id='note-text'
				placeholder='What do you want to write down?'
				text={text}
				onTextChange={setText}
				onBlur={() => markTouched('text')}
				error={textRequiredError}
				helperText={textRequiredError ? 'Note text is required.' : undefined}
				toolbarSx={{ justifyContent: 'flex-end', mt: 1 }}
			/>
		</FormPanel>
	);
}

export { CreateNoteTabPanel };
