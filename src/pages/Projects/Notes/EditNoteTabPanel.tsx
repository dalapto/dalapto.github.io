import { Box } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import React, { useCallback, useEffect, useState } from 'react';
import { StandardAutocomplete } from '../../../components/controls/StandardAutocomplete/StandardAutocomplete';
import { StandardCheckbox } from '../../../components/controls/StandardCheckbox/StandardCheckbox';
import { StandardTextArea } from '../../../components/controls/StandardTextArea/StandardTextArea';
import { StandardTextField } from '../../../components/controls/StandardTextField/StandardTextField';
import { ConfirmationModal } from '../../../components/layout/ConfirmationModal/ConfirmationModal';
import { FormPanel } from '../../../components/layout/FormPanel/FormPanel';
import {
	deleteNote,
	getNote,
	updateNote,
} from '../../../services/github.service';
import type { HeaderActions } from '../../../types/basic.types';
import type { Folder } from '../../../types/github.types';
import { getErrorMessage } from '../../../utils/getErrorMessage';

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
	onSaved: () => void;
	onAuthRequired: () => void;
	showToast: (
		message: string,
		severity: 'success' | 'error',
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
	const [isHidden, setIsHidden] = useState(true);
	const [text, setText] = useState('');
	const [loadedNote, setLoadedNote] = useState<LoadedNote | null>(null);
	const [loading, setLoading] = useState(false);
	const [saving, setSaving] = useState(false);
	const [deleting, setDeleting] = useState(false);
	const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

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
		setIsHidden(true);
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
		setLoading(true);

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
					showToast(getErrorMessage(error), 'error', error);
				}
			})
			.finally(() => {
				if (!cancelled) setLoading(false);
			});

		return () => {
			cancelled = true;
		};
	}, [folderName, githubToken, noteName, selectedFolder, showToast]);

	const performSave = useCallback(async () => {
		if (!githubToken || !selectedFolder || !loadedNote) return;

		const trimmedFolder = newFolder.trim();
		const trimmedTitle = newTitle.trim();
		const newFilename = `${trimmedTitle}.txt`;

		setSaving(true);
		try {
			const saved = await updateNote(githubToken, {
				folderId: loadedNote.folderId,
				filename: loadedNote.filename,
				content: text,
				newFilename:
					newFilename !== loadedNote.filename ? newFilename : undefined,
				newFolder:
					trimmedFolder !== loadedNote.folderName ? trimmedFolder : undefined,
			});
			showToast('Note updated.', 'success');
			onSaved();
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
		} catch (error) {
			showToast(getErrorMessage(error), 'error', error);
		} finally {
			setSaving(false);
		}
	}, [
		githubToken,
		loadedNote,
		newFolder,
		newTitle,
		onSaved,
		selectedFolder,
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
		setDeleting(true);
		try {
			await deleteNote(githubToken, selectedFolder.id, loadedNote.filename);
			showToast('Note deleted.', 'success');
			onSaved();
			clearSelectedNote();
		} catch (error) {
			showToast(getErrorMessage(error), 'error', error);
		} finally {
			setDeleting(false);
		}
	}, [
		githubToken,
		loadedNote,
		onSaved,
		clearSelectedNote,
		selectedFolder,
		showToast,
	]);

	function handleDeleteConfirm() {
		setConfirmDeleteOpen(false);
		void performDelete();
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
			text !== loadedNote.text);

	const newTitleError = isDuplicateNote;
	const newTitleHelperText = isDuplicateNote
		? 'A note with this title already exists in the target folder.'
		: undefined;

	const newFolderHelperText = isNewFolder
		? 'New folder will be created.'
		: undefined;

	const footerActions: HeaderActions = {
		start: [
			{
				id: 'delete',
				label: deleting ? 'Deleting…' : 'Delete',
				variant: 'outlined',
				color: 'danger',
				icon: <DeleteIcon />,
				onClick: () => setConfirmDeleteOpen(true),
				disabled: deleting || saving || loading || !loadedNote,
				hidden: !loadedNote,
			},
		],
		end: [
			{
				id: 'save',
				label: saving ? 'Saving…' : 'Save',
				variant: 'contained',
				onClick: handleSave,
				disabled:
					saving ||
					loading ||
					!loadedNote ||
					!trimmedNewFolder ||
					!trimmedNewTitle ||
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
				<Box sx={{ display: 'flex', gap: 2, minWidth: 0 }}>
					<StandardAutocomplete
						id='edit-note-folder'
						label='Folder'
						value={folderName}
						onChange={handleFolderChange}
						options={folderOptions}
						freeSolo={false}
						sx={{ flex: 1, minWidth: 0 }}
						required
					/>
					<StandardAutocomplete
						key={folderName}
						id='edit-note-name'
						label='Note'
						value={noteName}
						onChange={setNoteName}
						options={noteOptions}
						freeSolo={false}
						disabled={!selectedFolder || noteOptions.length === 0}
						helperText={
							selectedFolder && noteOptions.length === 0
								? 'This folder has no notes.'
								: undefined
						}
						sx={{ flex: 1, minWidth: 0 }}
						required
					/>
				</Box>
				{loadedNote && (
					<>
						<Box
							sx={{ display: 'flex', gap: 2, minWidth: 0, alignItems: 'start' }}
						>
							<StandardAutocomplete
								id='edit-note-target-folder'
								label='Target Folder'
								value={newFolder}
								onChange={setNewFolder}
								options={folderOptions}
								helperText={newFolderHelperText}
								sx={{ flex: 1, minWidth: 0 }}
								required
							/>
							<StandardTextField
								id='edit-note-title'
								label='Title'
								value={newTitle}
								onChange={(e) => setNewTitle(e.target.value)}
								sx={{ flex: 1, minWidth: 0 }}
								size='small'
								required
								error={newTitleError}
								helperText={newTitleHelperText}
							/>
							<StandardCheckbox
								label='Hidden'
								checked={isHidden}
								onChange={setIsHidden}
							/>
						</Box>
						<StandardTextArea
							id='edit-note-text'
							name='edit-note-text'
							placeholder='Edit your note…'
							value={text}
							onChange={setText}
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
