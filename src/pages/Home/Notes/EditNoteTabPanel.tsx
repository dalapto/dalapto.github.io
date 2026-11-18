import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';
import { Box } from '@mui/material';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { PageImageField } from '../../../components/controls/PageImageField/PageImageField';
import { StandardAutocomplete } from '../../../components/controls/StandardAutocomplete/StandardAutocomplete';
import { ConfirmationModal } from '../../../components/layout/ConfirmationModal/ConfirmationModal';
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
import { deleteNote, updateNote } from '../../../services/github/notes.service';
import type { ActionConfig, HeaderActions } from '../../../types/basic.types';
import type { Folder } from '../../../types/github.types';
import { filterArticleTextFilenames } from '../../../utils/article-page-image';
import { getErrorMessage } from '../../../utils/getErrorMessage';
import {
	fetchNoteWithOrder,
	findFolderByName,
	findNoteFilename,
	getArticleOptions,
	noteDisplayName,
	type NoteWithOrder,
	sectionExists,
	sectionFilename,
} from './note-form-helpers';
import { NoteTextEditor } from './NoteTextEditor';
import { SectionFields } from './SectionFields';
import { useArticleSave } from './useArticleSave';

type NoteField =
	| 'articleName'
	| 'noteName'
	| 'newArticle'
	| 'order'
	| 'newSection'
	| 'text';

const emptyTouched = {
	articleName: false,
	noteName: false,
	newArticle: false,
	order: false,
	newSection: false,
	text: false,
};

/** The section-form fields, reset whenever a note is (re)loaded or saved. */
const untouchedNoteFields = {
	newArticle: false,
	order: false,
	newSection: false,
	text: false,
};

interface LoadedNote {
	folderId: string;
	articleName: string;
	filename: string;
	section: string;
	text: string;
	updatedAt: string;
}

interface EditNoteTabPanelProps {
	folders: Folder[];
	onSaved: () => void | Promise<void>;
	showToast: ToastContextValue['showToast'];
}

function EditNoteTabPanel({
	folders,
	onSaved,
	showToast,
}: EditNoteTabPanelProps) {
	const { githubToken } = useGitHub();
	const { requestAuth } = useAuthRequest();
	const { busy, operation, setBusy } = useBusy();
	// Which note is selected.
	const [articleName, setArticleName] = useState('');
	const [noteName, setNoteName] = useState('');
	const [noteSelectKey, setNoteSelectKey] = useState(0);
	// The loaded note and its editable fields.
	const [loadedNote, setLoadedNote] = useState<LoadedNote | null>(null);
	const [newArticle, setNewArticle] = useState('');
	const [newSection, setNewSection] = useState('');
	const [order, setOrder] = useState('');
	const [committedOrder, setCommittedOrder] = useState('');
	const [text, setText] = useState('');
	const [touched, setTouched] = useState(emptyTouched);
	const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

	const {
		isHidden,
		setIsHidden,
		committedIsHidden,
		markCommitted: markHiddenCommitted,
		status: hiddenStatus,
		visibilityUnknown,
		retry: retryHiddenLoad,
	} = usePointerGistHidden(articleName, {
		token: githubToken,
		onError: (message) => showToast(message, ToastSeverity.WARNING),
	});

	// The page image belongs to the target article once a note is loaded.
	const pageImageArticleName = loadedNote ? newArticle : articleName;
	const {
		pageImage,
		showImageControl,
		commitArticle,
		markSaved,
		saveImageOnly,
		runBusyTask,
	} = useArticleSave({
		imageArticleName: pageImageArticleName,
		isHidden,
		visibilityUnknown,
		markHiddenCommitted,
		onSaved,
		showToast,
	});

	const markTouched = useCallback((field: NoteField) => {
		setTouched((prev) => (prev[field] ? prev : { ...prev, [field]: true }));
	}, []);

	const articleOptions = useMemo(() => getArticleOptions(folders), [folders]);
	const selectedArticle = folders.find((item) => item.name === articleName);
	const noteOptions = useMemo(() => {
		if (!selectedArticle) return [];
		return filterArticleTextFilenames(selectedArticle.noteFilenames).map(
			noteDisplayName,
		);
	}, [selectedArticle]);

	const clearSelectedNote = useCallback(() => {
		setNoteName('');
		setNewArticle('');
		setNewSection('');
		setOrder('');
		setCommittedOrder('');
		setText('');
		setLoadedNote(null);
		setNoteSelectKey((key) => key + 1);
		setTouched((prev) => ({ ...prev, noteName: false, ...untouchedNoteFields }));
	}, []);

	/** Fills the form from a freshly read note. */
	const applyLoadedNote = useCallback(
		(folderId: string, article: string, loaded: NoteWithOrder) => {
			setNewArticle(article);
			setNewSection(loaded.section);
			setOrder(loaded.order);
			setCommittedOrder(loaded.order);
			setText(loaded.content);
			setLoadedNote({
				folderId,
				articleName: article,
				filename: loaded.filename,
				section: loaded.section,
				text: loaded.content,
				updatedAt: loaded.updatedAt,
			});
			setTouched((prev) => ({ ...prev, ...untouchedNoteFields }));
		},
		[],
	);

	const handleArticleChange = useCallback(
		(value: string) => {
			if (!githubToken) {
				requestAuth();
				return;
			}
			setArticleName(value);
			clearSelectedNote();
		},
		[clearSelectedNote, githubToken, requestAuth],
	);

	const handleArticleOpen = useCallback(() => {
		if (!githubToken) requestAuth();
	}, [githubToken, requestAuth]);

	// Key the load on stable values, not the `selectedArticle` object: after a
	// save, onSaved() reloads `folders`, which gives the same article a new
	// identity. Re-running then would overwrite the just-saved form state with a
	// second (possibly stale) read and leave Save enabled.
	const selectedArticleId = selectedArticle?.id;
	const selectedNoteFilename = selectedArticle
		? findNoteFilename(selectedArticle, noteName)
		: undefined;

	useEffect(() => {
		if (!githubToken || !selectedArticleId || !noteName.trim()) {
			setNewArticle('');
			setNewSection('');
			setText('');
			setLoadedNote(null);
			return;
		}

		const filename = selectedNoteFilename;
		if (!filename) return;

		let cancelled = false;
		setBusy(true, {
			label: noteName.trim(),
			variant: 'spinner',
			operation: 'fetch',
		});

		fetchNoteWithOrder(githubToken, selectedArticleId, filename, articleName)
			.then((loaded) => {
				if (cancelled || !loaded) return;
				applyLoadedNote(selectedArticleId, articleName, loaded);
			})
			.catch((error) => {
				if (!cancelled) {
					showToast(getErrorMessage(error), ToastSeverity.ERROR, error);
				}
			})
			.finally(() => {
				if (!cancelled) setBusy(false);
			});

		return () => {
			cancelled = true;
		};
	}, [
		applyLoadedNote,
		articleName,
		githubToken,
		noteName,
		selectedArticleId,
		selectedNoteFilename,
		setBusy,
		showToast,
	]);

	const reloadSelectedNote = useCallback(async () => {
		if (!githubToken || !selectedArticle || !noteName.trim()) return;
		const filename = findNoteFilename(selectedArticle, noteName);
		if (!filename) return;

		await runBusyTask(
			{ label: noteName.trim(), variant: 'spinner', operation: 'fetch' },
			async () => {
				const loaded = await fetchNoteWithOrder(
					githubToken,
					selectedArticle.id,
					filename,
					articleName,
				);
				if (loaded) applyLoadedNote(selectedArticle.id, articleName, loaded);
			},
		);
	}, [
		applyLoadedNote,
		articleName,
		githubToken,
		noteName,
		runBusyTask,
		selectedArticle,
	]);

	const performSave = useCallback(async () => {
		// Never write `hidden` while it's unknown — that could unpublish the article.
		if (visibilityUnknown) return;
		if (!githubToken || !selectedArticle || !loadedNote) return;

		const trimmedArticle = newArticle.trim();
		const trimmedSection = newSection.trim();
		const newFilename = sectionFilename(newSection);

		await runBusyTask(
			{ label: trimmedSection, variant: 'progress', operation: 'save' },
			async () => {
				const isArticleMove = trimmedArticle !== loadedNote.articleName;
				const saved = await updateNote(githubToken, {
					folderId: loadedNote.folderId,
					filename: loadedNote.filename,
					content: text,
					newFilename:
						newFilename !== loadedNote.filename ? newFilename : undefined,
					newFolder: isArticleMove ? trimmedArticle : undefined,
				});
				const isRename =
					!isArticleMove &&
					newFilename.toLowerCase() !== loadedNote.filename.toLowerCase();
				// One index write for the whole save (move/rename/order/hidden/image).
				await commitArticle(githubToken, {
					gistId: saved.folderId,
					articleName: trimmedArticle,
					filename: newFilename,
					order,
					rename: isRename
						? { from: loadedNote.filename, to: newFilename }
						: undefined,
				});
				showToast(
					`Updated ${loadedNote.section} successfully.`,
					ToastSeverity.SUCCESS,
				);
				markSaved();
				await onSaved();
				setArticleName(trimmedArticle);
				setNoteName(trimmedSection);
				setNewArticle(trimmedArticle);
				setNewSection(trimmedSection);
				setLoadedNote({
					folderId: saved.folderId,
					articleName: trimmedArticle,
					filename: newFilename,
					section: trimmedSection,
					text,
					updatedAt: saved.updatedAt,
				});
				setCommittedOrder(order);
				setTouched((prev) => ({ ...prev, ...untouchedNoteFields }));
			},
		);
	}, [
		commitArticle,
		githubToken,
		loadedNote,
		markSaved,
		newArticle,
		newSection,
		onSaved,
		order,
		runBusyTask,
		selectedArticle,
		showToast,
		text,
		visibilityUnknown,
	]);

	const performDelete = useCallback(async () => {
		if (!githubToken || !selectedArticle || !loadedNote) return;

		await runBusyTask(
			{ label: loadedNote.section, variant: 'progress', operation: 'delete' },
			async () => {
				const { indexWarning } = await deleteNote(
					githubToken,
					selectedArticle.id,
					loadedNote.filename,
				);
				if (indexWarning) {
					showToast(
						`Deleted ${loadedNote.section}, but ${indexWarning}`,
						ToastSeverity.WARNING,
					);
				} else {
					showToast(
						`Deleted ${loadedNote.section} successfully.`,
						ToastSeverity.SUCCESS,
					);
				}
				clearSelectedNote();
				await onSaved();
			},
		);
	}, [
		clearSelectedNote,
		githubToken,
		loadedNote,
		onSaved,
		runBusyTask,
		selectedArticle,
		showToast,
	]);

	// --- Derived state: validation and what can be saved ---
	const trimmedNewArticle = newArticle.trim();
	const trimmedNewSection = newSection.trim();
	const newFilename = sectionFilename(newSection);
	const targetArticle = findFolderByName(folders, trimmedNewArticle);
	const isNewArticle = trimmedNewArticle !== '' && !targetArticle;
	const imageTargetFolder = findFolderByName(folders, pageImageArticleName);

	const isSameNoteInTarget =
		loadedNote !== null &&
		targetArticle?.id === loadedNote.folderId &&
		newFilename.toLowerCase() === loadedNote.filename.toLowerCase();
	const isDuplicateNote =
		loadedNote !== null &&
		!isSameNoteInTarget &&
		sectionExists(targetArticle, newFilename);

	const hasUnsavedChanges =
		loadedNote !== null &&
		(trimmedNewArticle !== loadedNote.articleName ||
			trimmedNewSection !== loadedNote.section ||
			text !== loadedNote.text ||
			order !== committedOrder ||
			isHidden !== committedIsHidden ||
			pageImage.hasImageChanges);

	// Also covers a page-image change made without a loaded note.
	useUnsavedChanges(
		hasUnsavedChanges || pageImage.hasImageChanges,
		'Notes (Edit)',
	);

	const canSaveNote =
		loadedNote !== null &&
		!!trimmedNewArticle &&
		!!trimmedNewSection &&
		!!text.trim() &&
		hasUnsavedChanges &&
		!isDuplicateNote &&
		!visibilityUnknown;
	const canSavePageImageOnly =
		showImageControl &&
		pageImage.hasImageChanges &&
		!!imageTargetFolder &&
		!loadedNote &&
		!visibilityUnknown;

	function handleSave() {
		if (!githubToken) {
			requestAuth();
			return;
		}
		if (canSavePageImageOnly && !canSaveNote && imageTargetFolder) {
			void saveImageOnly(imageTargetFolder);
			return;
		}
		void performSave();
	}

	function handleDeleteConfirm() {
		setConfirmDeleteOpen(false);
		void performDelete();
	}

	const articleNameRequiredError = touched.articleName && !articleName.trim();
	const noteNameRequiredError = touched.noteName && !noteName.trim();
	const newArticleRequiredError = touched.newArticle && !trimmedNewArticle;
	const newSectionRequiredError = touched.newSection && !trimmedNewSection;
	const textRequiredError = touched.text && !text.trim();

	const noteNameHelperText = noteNameRequiredError
		? 'Section is required.'
		: selectedArticle && noteOptions.length === 0
			? 'This article has no sections.'
			: undefined;

	const newArticleHelperText = newArticleRequiredError
		? 'Article is required.'
		: isNewArticle
			? 'New article will be created.'
			: undefined;

	const newSectionHelperText = isDuplicateNote
		? 'A note with this section already exists in the target article.'
		: newSectionRequiredError
			? 'Section is required.'
			: undefined;

	const refreshAction: ActionConfig = {
		id: 'refresh',
		label: 'Refresh',
		variant: 'outlined',
		icon: <RefreshIcon />,
		onClick: () => void reloadSelectedNote(),
		disabled: busy || !githubToken || !selectedArticle || !noteName.trim(),
	};

	const footerActions: HeaderActions = {
		start: [
			{
				id: 'delete',
				label: busy && operation === 'delete' ? 'Deleting…' : 'Delete',
				variant: 'outlined',
				color: 'danger',
				icon: <DeleteIcon />,
				onClick: () => setConfirmDeleteOpen(true),
				disabled: busy || !loadedNote,
				hidden: !loadedNote,
			},
		],
		end: [
			{
				id: 'clear',
				label: 'Clear',
				variant: 'outlined',
				onClick: () => setText(''),
				hidden: !loadedNote || !text.trim(),
			},
			{
				id: 'save',
				label: busy && operation === 'save' ? 'Saving…' : 'Save',
				variant: 'contained',
				onClick: handleSave,
				disabled:
					busy || (!canSaveNote && !canSavePageImageOnly) || isDuplicateNote,
			},
		],
	};

	return (
		<>
			<FormPanel
				footerActions={footerActions}
				sx={{
					minWidth: { xs: '80vw', sm: '50vw' },
					maxWidth: { xs: '80vw', sm: '50vw' },
				}}
			>
				<Box
					sx={{
						display: 'flex',
						flexDirection: 'column',
						gap: 2,
						minWidth: 0,
					}}
				>
					<Box
						sx={{
							display: 'flex',
							flexDirection: { xs: 'column', sm: 'row' },
							gap: 2,
							minWidth: 0,
							alignItems: { xs: 'stretch', sm: 'flex-start' },
						}}
					>
						<StandardAutocomplete
							id='edit-note-existing-article'
							label='Existing Article'
							value={articleName}
							onChange={handleArticleChange}
							onOpen={handleArticleOpen}
							onBlur={() => markTouched('articleName')}
							options={articleOptions}
							dropdownOnly
							error={articleNameRequiredError}
							helperText={
								articleNameRequiredError ? 'Article is required.' : undefined
							}
							sx={{ flex: { sm: 1 }, minWidth: 0, width: '100%' }}
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
					</Box>
					<StandardAutocomplete
						key={`${articleName}-${noteSelectKey}`}
						id='edit-note-existing-section'
						label='Existing Section'
						value={noteName}
						onChange={setNoteName}
						onBlur={() => markTouched('noteName')}
						options={noteOptions}
						dropdownOnly
						disabled={!selectedArticle || noteOptions.length === 0}
						error={noteNameRequiredError}
						helperText={noteNameHelperText}
						sx={{ minWidth: 0, width: { xs: '100%', sm: '50%' } }}
						required
					/>
				</Box>
				{loadedNote && (
					<>
						<Box
							sx={{
								display: 'flex',
								flexDirection: 'column',
								gap: 4,
								minWidth: 0,
								mt: 4,
							}}
						>
							<StandardAutocomplete
								id='edit-note-target-article'
								label='Target Article'
								value={newArticle}
								onChange={setNewArticle}
								onBlur={() => markTouched('newArticle')}
								options={articleOptions}
								error={newArticleRequiredError}
								helperText={newArticleHelperText}
								sx={{ minWidth: 0, width: { xs: '100%', sm: '50%' } }}
								required
							/>
							<SectionFields
								idPrefix='edit-note'
								order={order}
								onOrderChange={setOrder}
								onOrderBlur={() => markTouched('order')}
								section={newSection}
								onSectionChange={setNewSection}
								onSectionBlur={() => markTouched('newSection')}
								sectionError={isDuplicateNote || newSectionRequiredError}
								sectionHelperText={newSectionHelperText}
								isHidden={isHidden}
								onHiddenChange={setIsHidden}
								hiddenStatus={hiddenStatus}
								onHiddenRetry={retryHiddenLoad}
							/>
						</Box>
						<NoteTextEditor
							id='edit-note-text'
							placeholder='Edit your note…'
							text={text}
							onTextChange={setText}
							onBlur={() => markTouched('text')}
							error={textRequiredError}
							helperText={textRequiredError ? 'Note text is required.' : undefined}
							startActions={[refreshAction]}
							toolbarSx={{ mt: 4 }}
						/>
						<p style={{ margin: 0, fontSize: '0.8125rem', opacity: 0.6 }}>
							Last updated: {new Date(loadedNote.updatedAt).toLocaleString()}
						</p>
					</>
				)}
			</FormPanel>

			<ConfirmationModal
				open={confirmDeleteOpen}
				onClose={() => setConfirmDeleteOpen(false)}
				onConfirm={handleDeleteConfirm}
				title='Delete note?'
				message={
					<>
						<strong>{loadedNote?.section}</strong> will be permanently deleted.
						This cannot be undone.
					</>
				}
				confirmLabel='Delete'
				danger
			/>
		</>
	);
}

export { EditNoteTabPanel };
