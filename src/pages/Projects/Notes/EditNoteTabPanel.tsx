import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';
import { Box, FormHelperText } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { StandardAutocomplete } from '../../../components/controls/StandardAutocomplete/StandardAutocomplete';
import { StandardCheckbox } from '../../../components/controls/StandardCheckbox/StandardCheckbox';
import { StandardTextArea } from '../../../components/controls/StandardTextArea/StandardTextArea';
import { StandardTextField } from '../../../components/controls/StandardTextField/StandardTextField';
import { ConfirmationModal } from '../../../components/layout/ConfirmationModal/ConfirmationModal';
import {
	ActionToolbar,
	FormPanel,
} from '../../../components/layout/FormPanel/FormPanel';
import { useBusy } from '../../../context/BusyContext';
import { ToastSeverity } from '../../../context/ToastProvider';
import { useTextClipboard } from '../../../hooks/useTextClipboard';
import {
	deleteNote,
	getNote,
	updateNote,
} from '../../../services/github.service';
import type { HeaderActions } from '../../../types/basic.types';
import type { Folder } from '../../../types/github.types';
import { getErrorMessage } from '../../../utils/getErrorMessage';

type NoteField = 'folderName' | 'noteName' | 'newFolder' | 'newTitle' | 'text';

const emptyTouched = {
	folderName: false,
	noteName: false,
	newFolder: false,
	newTitle: false,
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
	folderName: string;
	filename: string;
	title: string;
	text: string;
	updatedAt: string;
}

interface EditNoteTabPanelProps {
	folders: Folder[];
	githubToken: string | null;
	onSaved: () => void | Promise<void>;
	onAuthRequired: () => void;
	showToast: (
		message: string,
		severity: ToastSeverity,
		error?: unknown,
	) => void;
}

function EditNoteTabPanel({
	folders,
	githubToken,
	onSaved,
	onAuthRequired,
	showToast,
}: EditNoteTabPanelProps) {
	const [folderName, setFolderName] = useState('');
	const [noteName, setNoteName] = useState('');
	const [newFolder, setNewFolder] = useState('');
	const [newTitle, setNewTitle] = useState('');
	const [isPublic, setIsPublic] = useState(false);
	const [committedIsPublic, setCommittedIsPublic] = useState(false);
	const [text, setText] = useState('');
	const [loadedNote, setLoadedNote] = useState<LoadedNote | null>(null);
	const { busy, operation, setBusy } = useBusy();
	const [noteSelectKey, setNoteSelectKey] = useState(0);
	const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
	const [touched, setTouched] = useState(emptyTouched);

	const { copy, paste } = useTextClipboard(text, setText);

	const markTouched = useCallback((field: NoteField) => {
		setTouched((prev) => (prev[field] ? prev : { ...prev, [field]: true }));
	}, []);

	const folderOptions = folders.map((item) => item.name);
	const selectedFolder = folders.find((item) => item.name === folderName);
	const noteOptions =
		selectedFolder?.noteFilenames.map((filename) =>
			noteDisplayName(filename),
		) ?? [];

	const clearSelectedNote = useCallback(() => {
		setNoteName('');
		setNewFolder('');
		setNewTitle('');
		setText('');
		setLoadedNote(null);
		setIsPublic(false);
		setCommittedIsPublic(false);
		setNoteSelectKey((key) => key + 1);
		setTouched((prev) => ({
			...prev,
			noteName: false,
			newFolder: false,
			newTitle: false,
			text: false,
		}));
	}, []);

	const handleFolderChange = useCallback(
		(newFolderValue: string) => {
			setFolderName(newFolderValue);
			clearSelectedNote();
		},
		[clearSelectedNote],
	);

	useEffect(() => {
		if (!githubToken || !selectedFolder || !noteName.trim()) {
			setNewFolder('');
			setNewTitle('');
			setText('');
			setLoadedNote(null);
			return;
		}

		const filename = findNoteFilename(selectedFolder, noteName);
		if (!filename) return;

		let cancelled = false;
		setBusy(true, {
			label: noteName.trim(),
			variant: 'spinner',
			operation: 'fetch',
		});

		getNote(githubToken, selectedFolder.id, filename)
			.then((note) => {
				if (cancelled || !note) return;
				const displayTitle = noteDisplayName(note.filename);
				setNewFolder(folderName);
				setNewTitle(displayTitle);
				setText(note.content);
				setLoadedNote({
					folderId: selectedFolder.id,
					folderName,
					filename: note.filename,
					title: displayTitle,
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
	}, [folderName, githubToken, noteName, selectedFolder, setBusy, showToast]);

	const performSave = useCallback(async () => {
		if (!githubToken || !selectedFolder || !loadedNote) return;

		const trimmedFolder = newFolder.trim();
		const trimmedTitle = newTitle.trim();
		const newFilename = `${trimmedTitle}.txt`;

		setBusy(true, {
			label: trimmedTitle,
			variant: 'progress',
			operation: 'save',
		});
		try {
			const saved = await updateNote(githubToken, {
				folderId: loadedNote.folderId,
				filename: loadedNote.filename,
				content: text,
				newFilename:
					newFilename !== loadedNote.filename ? newFilename : undefined,
				newFolder:
					trimmedFolder !== loadedNote.folderName ? trimmedFolder : undefined,
				isPublic: isPublic,
			});
			showToast(
				`Updated ${loadedNote.title} successfully.`,
				ToastSeverity.SUCCESS,
			);
			await onSaved();
			setFolderName(trimmedFolder);
			setNoteName(trimmedTitle);
			setNewFolder(trimmedFolder);
			setNewTitle(trimmedTitle);
			setLoadedNote({
				folderId: saved.folderId,
				folderName: trimmedFolder,
				filename: newFilename,
				title: trimmedTitle,
				text,
				updatedAt: saved.updatedAt,
			});
			setCommittedIsPublic(isPublic);
			setTouched((prev) => ({
				...prev,
				newFolder: false,
				newTitle: false,
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
		isPublic,
		loadedNote,
		newFolder,
		newTitle,
		onSaved,
		selectedFolder,
		setBusy,
		showToast,
		text,
	]);

	function handleSave() {
		if (!githubToken) {
			onAuthRequired();
			return;
		}
		void performSave();
	}

	const performDelete = useCallback(async () => {
		if (!githubToken || !selectedFolder || !loadedNote) return;
		setBusy(true, {
			label: loadedNote.title,
			variant: 'progress',
			operation: 'delete',
		});
		try {
			await deleteNote(githubToken, selectedFolder.id, loadedNote.filename);
			showToast(
				`Deleted ${loadedNote.title} successfully.`,
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
		selectedFolder,
		setBusy,
		showToast,
	]);

	function handleDeleteConfirm() {
		setConfirmDeleteOpen(false);
		void performDelete();
	}

	const reloadSelectedNote = useCallback(async () => {
		if (!githubToken || !selectedFolder || !noteName.trim()) return;

		const filename = findNoteFilename(selectedFolder, noteName);
		if (!filename) return;

		setBusy(true, {
			label: noteName.trim(),
			variant: 'spinner',
			operation: 'fetch',
		});
		try {
			const note = await getNote(githubToken, selectedFolder.id, filename);
			if (!note) return;

			const displayTitle = noteDisplayName(note.filename);
			setNewFolder(folderName);
			setNewTitle(displayTitle);
			setText(note.content);
			setLoadedNote({
				folderId: selectedFolder.id,
				folderName,
				filename: note.filename,
				title: displayTitle,
				text: note.content,
				updatedAt: note.updatedAt,
			});
			setTouched((prev) => ({
				...prev,
				newFolder: false,
				newTitle: false,
				text: false,
			}));
		} catch (error) {
			console.error(error);
			showToast(getErrorMessage(error), ToastSeverity.ERROR, error);
		} finally {
			setBusy(false);
		}
	}, [folderName, githubToken, noteName, selectedFolder, setBusy, showToast]);

	function handleClearText() {
		setText('');
	}

	const trimmedNewFolder = newFolder.trim();
	const trimmedNewTitle = newTitle.trim();
	const newFilename = trimmedNewTitle ? `${trimmedNewTitle}.txt` : '';

	const targetFolder = folders.find(
		(item) => item.name.toLowerCase() === trimmedNewFolder.toLowerCase(),
	);

	const isNewFolder =
		trimmedNewFolder !== '' &&
		!folders.some(
			(item) => item.name.toLowerCase() === trimmedNewFolder.toLowerCase(),
		);

	const isSameNoteInTarget =
		loadedNote !== null &&
		targetFolder?.id === loadedNote.folderId &&
		newFilename.toLowerCase() === loadedNote.filename.toLowerCase();

	const isDuplicateNote =
		loadedNote !== null &&
		newFilename !== '' &&
		!isSameNoteInTarget &&
		(targetFolder?.noteFilenames.some(
			(name) => name.toLowerCase() === newFilename.toLowerCase(),
		) ??
			false);

	const hasUnsavedChanges =
		loadedNote !== null &&
		(trimmedNewFolder !== loadedNote.folderName ||
			trimmedNewTitle !== loadedNote.title ||
			text !== loadedNote.text ||
			isPublic !== committedIsPublic);

	const folderNameRequiredError = touched.folderName && !folderName.trim();
	const noteNameRequiredError = touched.noteName && !noteName.trim();
	const newFolderRequiredError = touched.newFolder && !trimmedNewFolder;
	const newTitleRequiredError = touched.newTitle && !trimmedNewTitle;
	const textRequiredError = touched.text && !text.trim();

	const folderNameHelperText = folderNameRequiredError
		? 'Folder is required.'
		: undefined;

	const noteNameHelperText = noteNameRequiredError
		? 'Note is required.'
		: selectedFolder && noteOptions.length === 0
		? 'This folder has no notes.'
		: undefined;

	const newFolderError = newFolderRequiredError;
	const newFolderHelperText = newFolderRequiredError
		? 'Folder is required.'
		: isNewFolder
		? 'New folder will be created.'
		: undefined;

	const newTitleError = isDuplicateNote || newTitleRequiredError;
	const newTitleHelperText = isDuplicateNote
		? 'A note with this title already exists in the target folder.'
		: newTitleRequiredError
		? 'Title is required.'
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
					busy || !githubToken || !selectedFolder || !noteName.trim(),
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
					!loadedNote ||
					!trimmedNewFolder ||
					!trimmedNewTitle ||
					!text.trim() ||
					!hasUnsavedChanges ||
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
						flexDirection: { xs: 'column', sm: 'row' },
						gap: 2,
						minWidth: 0,
						alignItems: { xs: 'stretch', sm: 'start' },
					}}
				>
					<StandardAutocomplete
						id='edit-note-folder'
						label='Existing Folder'
						value={folderName}
						onChange={handleFolderChange}
						onBlur={() => markTouched('folderName')}
						options={folderOptions}
						freeSolo={false}
						error={folderNameRequiredError}
						helperText={folderNameHelperText}
						sx={{ flex: { sm: 1 }, minWidth: 0, width: '100%' }}
						required
					/>
					<StandardAutocomplete
						key={`${folderName}-${noteSelectKey}`}
						id='edit-note-name'
						label='Existing Note'
						value={noteName}
						onChange={setNoteName}
						onBlur={() => markTouched('noteName')}
						options={noteOptions}
						freeSolo={false}
						disabled={!selectedFolder || noteOptions.length === 0}
						error={noteNameRequiredError}
						helperText={noteNameHelperText}
						sx={{ flex: { sm: 1 }, minWidth: 0, width: '100%' }}
						required
					/>
				</Box>
				{loadedNote && (
					<>
						<Box
							sx={{
								display: 'flex',
								flexDirection: 'column',
								gap: 0,
								minWidth: 0,
								mt: 4,
							}}
						>
							{/* Target Folder + Public (with helper text directly below checkbox) */}
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
								<StandardAutocomplete
									id='edit-note-target-folder'
									label='Target Folder'
									value={newFolder}
									onChange={setNewFolder}
									onBlur={() => markTouched('newFolder')}
									options={folderOptions}
									error={newFolderError}
									helperText={newFolderHelperText}
									sx={{ flex: { sm: 1 }, minWidth: 0, width: '100%' }}
									required
								/>
								<Box
									sx={{
										position: 'relative',
										flexShrink: 0,
										alignSelf: 'flex-start',
									}}
								>
									<StandardCheckbox
										label='Public'
										checked={isPublic}
										onChange={setIsPublic}
									/>
									{isPublic !== committedIsPublic && (
										<FormHelperText
											sx={{
												position: 'absolute',
												top: '100%',
												left: 0,
												mt: 0.5,
												mx: 0,
												whiteSpace: 'nowrap',
											}}
										>
											This will affect all notes in this folder.
										</FormHelperText>
									)}
								</Box>
							</Box>
							<StandardTextField
								id='edit-note-title'
								label='Title'
								value={newTitle}
								onChange={(e) => setNewTitle(e.target.value)}
								onBlur={() => markTouched('newTitle')}
								sx={{ minWidth: 0, width: { xs: '100%', sm: '50%' }, mt: 6 }}
								size='small'
								required
								error={newTitleError}
								helperText={newTitleHelperText}
							/>
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
						<strong>{loadedNote?.title}</strong> will be permanently deleted.
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
