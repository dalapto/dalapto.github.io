import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';
import { Box } from '@mui/material';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { StandardAutocomplete } from '../../../components/controls/StandardAutocomplete/StandardAutocomplete';
import { StandardCheckbox } from '../../../components/controls/StandardCheckbox/StandardCheckbox';
import { StandardTextArea } from '../../../components/controls/StandardTextArea/StandardTextArea';
import { StandardTextField } from '../../../components/controls/StandardTextField/StandardTextField';
import { ConfirmationModal } from '../../../components/layout/ConfirmationModal/ConfirmationModal';
import { PageImageField } from '../../../components/controls/PageImageField/PageImageField';
import {
	ActionToolbar,
	FormPanel,
} from '../../../components/layout/FormPanel/FormPanel';
import { useAuthRequest } from '../../../context/AuthRequestContext';
import { useBusy } from '../../../context/BusyContext';
import { useGitHub } from '../../../context/GitHubContext';
import { ToastSeverity } from '../../../context/ToastProvider';
import { useTextClipboard } from '../../../hooks/useTextClipboard';
import { usePageImageField } from '../../../hooks/usePageImageField';
import {
	deleteNote,
	fetchPointerGistEntryByFolderName,
	getNote,
	isPointerGistFolder,
	movePointerGistEntry,
	reconcilePointerGist,
	registerPointerGistEntry,
	syncArticlePageImage,
	updateNote,
} from '../../../services/github.service';
import type { HeaderActions } from '../../../types/basic.types';
import type { Folder } from '../../../types/github.types';
import { filterArticleTextFilenames } from '../../../utils/article-page-image';
import { getErrorMessage } from '../../../utils/getErrorMessage';
import { isStaticWritingFolderKey } from '../../../utils/writing-articles';

type NoteField =
	| 'articleName'
	| 'noteName'
	| 'newArticle'
	| 'newSection'
	| 'text';

const emptyTouched = {
	articleName: false,
	noteName: false,
	newArticle: false,
	newSection: false,
	text: false,
};

function noteDisplayName(filename: string): string {
	return filename.replace(/\.txt$/i, '');
}

function findNoteFilename(
	folder: Folder,
	displayName: string,
): string | undefined {
	const target = `${displayName.trim()}.txt`;
	return folder.noteFilenames.find(
		(name) => name.toLowerCase() === target.toLowerCase(),
	);
}

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
	showToast: (
		message: string,
		severity: ToastSeverity,
		error?: unknown,
	) => void;
}

function EditNoteTabPanel({
	folders,
	onSaved,
	showToast,
}: EditNoteTabPanelProps) {
	const { githubToken } = useGitHub();
	const { requestAuth } = useAuthRequest();
	const [articleName, setArticleName] = useState('');
	const [noteName, setNoteName] = useState('');
	const [newArticle, setNewArticle] = useState('');
	const [newSection, setNewSection] = useState('');
	const [isHidden, setIsHidden] = useState(true);
	const [committedIsHidden, setCommittedIsHidden] = useState(true);
	const [text, setText] = useState('');
	const [loadedNote, setLoadedNote] = useState<LoadedNote | null>(null);
	const { busy, operation, setBusy } = useBusy();
	const [noteSelectKey, setNoteSelectKey] = useState(0);
	const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
	const [touched, setTouched] = useState(emptyTouched);

	const { copy, paste } = useTextClipboard(text, setText);
	const pageImageArticleName = loadedNote ? newArticle : articleName;
	const showPageImageControl =
		pageImageArticleName.trim() !== '' &&
		!isStaticWritingFolderKey(pageImageArticleName);
	const {
		previewUrl: pageImageUrl,
		pendingFile: pendingPageImageFile,
		removed: pageImageRemoved,
		hasImageChanges: hasPageImageChanges,
		handleFileSelect: handlePageImageSelect,
		handleRemove: handlePageImageRemove,
		resetAfterSave: resetPageImageAfterSave,
		loading: pageImageLoading,
	} = usePageImageField(showPageImageControl ? pageImageArticleName : '', (message) =>
		showToast(message, ToastSeverity.ERROR),
	);

	useEffect(() => {
		if (!articleName.trim() || isStaticWritingFolderKey(articleName)) return;

		let cancelled = false;
		fetchPointerGistEntryByFolderName(articleName)
			.then((entry) => {
				if (cancelled || !entry) return;
				setIsHidden(entry.hidden);
				setCommittedIsHidden(entry.hidden);
			})
			.catch(() => {
				if (!cancelled) {
					setIsHidden(true);
					setCommittedIsHidden(true);
				}
			});

		return () => {
			cancelled = true;
		};
	}, [articleName]);

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
	const selectedArticle = folders.find((item) => item.name === articleName);
	const noteOptions = useMemo(() => {
		if (!selectedArticle) return [];
		return filterArticleTextFilenames(selectedArticle.noteFilenames).map(
			(filename) => noteDisplayName(filename),
		);
	}, [selectedArticle]);

	const clearSelectedNote = useCallback(() => {
		setNoteName('');
		setNewArticle('');
		setNewSection('');
		setText('');
		setLoadedNote(null);
		setNoteSelectKey((key) => key + 1);
		setTouched((prev) => ({
			...prev,
			noteName: false,
			newArticle: false,
			newSection: false,
			text: false,
		}));
	}, []);

	const handleArticleChange = useCallback(
		(newArticleValue: string) => {
			if (!githubToken) {
				requestAuth();
				return;
			}
			setArticleName(newArticleValue);
			clearSelectedNote();
		},
		[clearSelectedNote, githubToken, requestAuth],
	);

	const handleArticleOpen = useCallback(() => {
		if (!githubToken) {
			requestAuth();
		}
	}, [githubToken, requestAuth]);

	useEffect(() => {
		if (!githubToken || !selectedArticle || !noteName.trim()) {
			setNewArticle('');
			setNewSection('');
			setText('');
			setLoadedNote(null);
			return;
		}

		const filename = findNoteFilename(selectedArticle, noteName);
		if (!filename) return;

		let cancelled = false;
		setBusy(true, {
			label: noteName.trim(),
			variant: 'spinner',
			operation: 'fetch',
		});

		getNote(githubToken, selectedArticle.id, filename)
			.then((note) => {
				if (cancelled || !note) return;
				const displaySection = noteDisplayName(note.filename);
				setNewArticle(articleName);
				setNewSection(displaySection);
				setText(note.content);
				setLoadedNote({
					folderId: selectedArticle.id,
					articleName,
					filename: note.filename,
					section: displaySection,
					text: note.content,
					updatedAt: note.updatedAt,
				});
			})
			.catch((error) => {
				if (!cancelled) {
					console.error(error);
					showToast(getErrorMessage(error), ToastSeverity.ERROR, error);
				}
			})
			.finally(() => {
				if (!cancelled) setBusy(false);
			});

		return () => {
			cancelled = true;
		};
	}, [articleName, githubToken, noteName, selectedArticle, setBusy, showToast]);

	const imageTargetFolder = folders.find(
		(item) =>
			item.name.toLowerCase() === pageImageArticleName.trim().toLowerCase(),
	);

	const syncPageImage = useCallback(
		async (folderId: string, targetArticle: string) => {
			if (!hasPageImageChanges || isStaticWritingFolderKey(targetArticle)) {
				return;
			}
			await syncArticlePageImage(githubToken!, folderId, {
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

	const performSavePageImageOnly = useCallback(async () => {
		if (!githubToken || !imageTargetFolder || !hasPageImageChanges) {
			requestAuth();
			return;
		}

		const targetArticle = pageImageArticleName.trim();
		setBusy(true, {
			label: 'page image',
			variant: 'progress',
			operation: 'save',
		});
		try {
			await registerPointerGistEntry(
				githubToken,
				imageTargetFolder.id,
				targetArticle,
				filterArticleTextFilenames(imageTargetFolder.noteFilenames),
				isHidden,
			);
			await syncPageImage(imageTargetFolder.id, targetArticle);
			showToast('Page image saved.', ToastSeverity.SUCCESS);
			setCommittedIsHidden(isHidden);
			resetPageImageAfterSave();
			await onSaved();
		} catch (error) {
			console.error(error);
			showToast(getErrorMessage(error), ToastSeverity.ERROR, error);
		} finally {
			setBusy(false);
		}
	}, [
		githubToken,
		hasPageImageChanges,
		imageTargetFolder,
		isHidden,
		onSaved,
		pageImageArticleName,
		registerPointerGistEntry,
		requestAuth,
		resetPageImageAfterSave,
		setBusy,
		showToast,
		syncPageImage,
	]);

	const performSave = useCallback(async () => {
		if (!githubToken || !selectedArticle || !loadedNote) return;

		const trimmedArticle = newArticle.trim();
		const trimmedSection = newSection.trim();
		const newFilename = `${trimmedSection}.txt`;

		setBusy(true, {
			label: trimmedSection,
			variant: 'progress',
			operation: 'save',
		});
		try {
			const isArticleMove = trimmedArticle !== loadedNote.articleName;
			const saved = await updateNote(githubToken, {
				folderId: loadedNote.folderId,
				filename: loadedNote.filename,
				content: text,
				newFilename:
					newFilename !== loadedNote.filename ? newFilename : undefined,
				newFolder: isArticleMove ? trimmedArticle : undefined,
			});
			if (isArticleMove) {
				await movePointerGistEntry(
					githubToken,
					saved.folderId,
					loadedNote.articleName,
					trimmedArticle,
					isHidden,
				);
			}
			await reconcilePointerGist(githubToken, saved.folderId, isHidden);
			await syncPageImage(saved.folderId, trimmedArticle);
			showToast(
				`Updated ${loadedNote.section} successfully.`,
				ToastSeverity.SUCCESS,
			);
			resetPageImageAfterSave();
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
			setCommittedIsHidden(isHidden);
			setTouched((prev) => ({
				...prev,
				newArticle: false,
				newSection: false,
				text: false,
			}));
		} catch (error) {
			console.error(error);
			showToast(getErrorMessage(error), ToastSeverity.ERROR, error);
		} finally {
			setBusy(false);
		}
	}, [
		githubToken,
		isHidden,
		loadedNote,
		movePointerGistEntry,
		newArticle,
		newSection,
		onSaved,
		reconcilePointerGist,
		resetPageImageAfterSave,
		selectedArticle,
		setBusy,
		showToast,
		syncPageImage,
		text,
	]);

	function handleSave() {
		if (!githubToken) {
			requestAuth();
			return;
		}
		if (canSavePageImageOnly && !canSaveNote) {
			void performSavePageImageOnly();
			return;
		}
		void performSave();
	}

	const performDelete = useCallback(async () => {
		if (!githubToken || !selectedArticle || !loadedNote) return;
		setBusy(true, {
			label: loadedNote.section,
			variant: 'progress',
			operation: 'delete',
		});
		try {
			await deleteNote(githubToken, selectedArticle.id, loadedNote.filename);
			showToast(
				`Deleted ${loadedNote.section} successfully.`,
				ToastSeverity.SUCCESS,
			);
			clearSelectedNote();
			await onSaved();
		} catch (error) {
			console.error(error);
			showToast(getErrorMessage(error), ToastSeverity.ERROR, error);
		} finally {
			setBusy(false);
		}
	}, [
		githubToken,
		loadedNote,
		onSaved,
		clearSelectedNote,
		selectedArticle,
		setBusy,
		showToast,
	]);

	function handleDeleteConfirm() {
		setConfirmDeleteOpen(false);
		void performDelete();
	}

	const reloadSelectedNote = useCallback(async () => {
		if (!githubToken || !selectedArticle || !noteName.trim()) return;

		const filename = findNoteFilename(selectedArticle, noteName);
		if (!filename) return;

		setBusy(true, {
			label: noteName.trim(),
			variant: 'spinner',
			operation: 'fetch',
		});
		try {
			const note = await getNote(githubToken, selectedArticle.id, filename);
			if (!note) return;

			const displaySection = noteDisplayName(note.filename);
			setNewArticle(articleName);
			setNewSection(displaySection);
			setText(note.content);
			setLoadedNote({
				folderId: selectedArticle.id,
				articleName,
				filename: note.filename,
				section: displaySection,
				text: note.content,
				updatedAt: note.updatedAt,
			});
			setTouched((prev) => ({
				...prev,
				newArticle: false,
				newSection: false,
				text: false,
			}));
		} catch (error) {
			console.error(error);
			showToast(getErrorMessage(error), ToastSeverity.ERROR, error);
		} finally {
			setBusy(false);
		}
	}, [articleName, githubToken, noteName, selectedArticle, setBusy, showToast]);

	function handleClearText() {
		setText('');
	}

	const trimmedNewArticle = newArticle.trim();
	const trimmedNewSection = newSection.trim();
	const newFilename = trimmedNewSection ? `${trimmedNewSection}.txt` : '';

	const targetArticle = folders.find(
		(item) => item.name.toLowerCase() === trimmedNewArticle.toLowerCase(),
	);

	const isNewArticle =
		trimmedNewArticle !== '' &&
		!folders.some(
			(item) => item.name.toLowerCase() === trimmedNewArticle.toLowerCase(),
		);

	const isSameNoteInTarget =
		loadedNote !== null &&
		targetArticle?.id === loadedNote.folderId &&
		newFilename.toLowerCase() === loadedNote.filename.toLowerCase();

	const isDuplicateNote =
		loadedNote !== null &&
		newFilename !== '' &&
		!isSameNoteInTarget &&
		(targetArticle
			? filterArticleTextFilenames(targetArticle.noteFilenames).some(
					(name) => name.toLowerCase() === newFilename.toLowerCase(),
				)
			: false);

	const hasUnsavedChanges =
		loadedNote !== null &&
		(trimmedNewArticle !== loadedNote.articleName ||
			trimmedNewSection !== loadedNote.section ||
			text !== loadedNote.text ||
			isHidden !== committedIsHidden ||
			hasPageImageChanges);

	const canSaveNote =
		loadedNote !== null &&
		!!trimmedNewArticle &&
		!!trimmedNewSection &&
		!!text.trim() &&
		hasUnsavedChanges &&
		!isDuplicateNote;
	const canSavePageImageOnly =
		showPageImageControl &&
		hasPageImageChanges &&
		!!imageTargetFolder &&
		!loadedNote;

	const articleNameRequiredError = touched.articleName && !articleName.trim();
	const noteNameRequiredError = touched.noteName && !noteName.trim();
	const newArticleRequiredError = touched.newArticle && !trimmedNewArticle;
	const newSectionRequiredError = touched.newSection && !trimmedNewSection;
	const textRequiredError = touched.text && !text.trim();

	const articleNameHelperText = articleNameRequiredError
		? 'Article is required.'
		: undefined;

	const noteNameHelperText = noteNameRequiredError
		? 'Article is required.'
		: selectedArticle && noteOptions.length === 0
		? 'This article has no articles.'
		: undefined;

	const newArticleError = newArticleRequiredError;
	const newArticleHelperText = newArticleRequiredError
		? 'Article is required.'
		: isNewArticle
		? 'New article will be created.'
		: undefined;

	const newSectionError = isDuplicateNote || newSectionRequiredError;
	const newSectionHelperText = isDuplicateNote
		? 'A note with this section already exists in the target article.'
		: newSectionRequiredError
		? 'Section is required.'
		: undefined;

	const textHelperText = textRequiredError
		? 'Note text is required.'
		: undefined;

	const textToolbarActions: HeaderActions = {
		start: [
			{
				id: 'refresh',
				label: 'Refresh',
				variant: 'outlined',
				icon: <RefreshIcon />,
				onClick: () => void reloadSelectedNote(),
				disabled:
					busy || !githubToken || !selectedArticle || !noteName.trim(),
			},
		],
		end: [
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
		],
	};

	const footerActions: HeaderActions = {
		start: [
			{
				id: 'delete',
				label:
					busy && operation === 'delete' ? 'Deleting…' : 'Delete',
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
				onClick: handleClearText,
				hidden: !loadedNote || !text.trim(),
			},
			{
				id: 'save',
				label: busy && operation === 'save' ? 'Saving…' : 'Save',
				variant: 'contained',
				onClick: handleSave,
				disabled:
					busy ||
					(!canSaveNote && !canSavePageImageOnly) ||
					isDuplicateNote,
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
							helperText={articleNameHelperText}
							sx={{ flex: { sm: 1 }, minWidth: 0, width: '100%' }}
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
								error={newArticleError}
								helperText={newArticleHelperText}
								sx={{ minWidth: 0, width: { xs: '100%', sm: '50%' } }}
								required
							/>
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
									id='edit-note-section'
									label='Section'
									value={newSection}
									onChange={(e) => setNewSection(e.target.value)}
									onBlur={() => markTouched('newSection')}
									sx={{ flex: { sm: 1 }, minWidth: 0, width: '100%' }}
									size='small'
									required
									error={newSectionError}
									helperText={newSectionHelperText}
								/>
								<Box
									sx={{
										position: 'relative',
										flexShrink: 0,
										alignSelf: 'flex-start',
									}}
								>
									<StandardCheckbox
										label='Hidden'
										checked={isHidden}
										onChange={setIsHidden}
									/>
								</Box>
							</Box>
						</Box>
						<ActionToolbar actions={textToolbarActions} sx={{ mt: 4 }} />
						<StandardTextArea
							id='edit-note-text'
							name='edit-note-text'
							placeholder='Edit your note…'
							value={text}
							onChange={setText}
							onBlur={() => markTouched('text')}
							error={textRequiredError}
							helperText={textHelperText}
							required
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
