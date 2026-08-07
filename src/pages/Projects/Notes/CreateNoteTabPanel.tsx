import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import { Box } from '@mui/material';
import React, { useCallback, useState } from 'react';
import { StandardAutocomplete } from '../../../components/controls/StandardAutocomplete/StandardAutocomplete';
import { StandardCheckbox } from '../../../components/controls/StandardCheckbox/StandardCheckbox';
import { StandardTextArea } from '../../../components/controls/StandardTextArea/StandardTextArea';
import { StandardTextField } from '../../../components/controls/StandardTextField/StandardTextField';
import {
	ActionToolbar,
	FormPanel,
} from '../../../components/layout/FormPanel/FormPanel';
import { ToastSeverity } from '../../../context/ToastProvider';
import { useTextClipboard } from '../../../hooks/useTextClipboard';
import { saveNote } from '../../../services/github.service';
import type { ActionConfig } from '../../../types/basic.types';
import type { Folder } from '../../../types/github.types';
import { getErrorMessage } from '../../../utils/getErrorMessage';

type NoteField = 'title' | 'folder' | 'text';

const emptyTouched = { title: false, folder: false, text: false };

interface CreateNoteTabPanelProps {
	folders: Folder[];
	githubToken: string | null;
	onSaved: () => void;
	onAuthRequired: () => void;
	showToast: (
		message: string,
		severity: ToastSeverity,
		error?: unknown,
	) => void;
}

function CreateNoteTabPanel({
	folders,
	githubToken,
	onSaved,
	onAuthRequired,
	showToast,
}: CreateNoteTabPanelProps) {
	const [title, setTitle] = useState('');
	const [isHidden, setIsHidden] = useState(true);
	const [text, setText] = useState('');
	const [folder, setFolder] = useState('');
	const [saving, setSaving] = useState(false);
	const [touched, setTouched] = useState(emptyTouched);

	const { copy, paste } = useTextClipboard(text, setText);

	const markTouched = useCallback((field: NoteField) => {
		setTouched((prev) => (prev[field] ? prev : { ...prev, [field]: true }));
	}, []);

	const folderOptions = folders.map((item) => item.name);

	const performSave = useCallback(async () => {
		if (!githubToken) return;

		const folderName = folder.trim();
		const filename = `${title.trim()}.txt`;

		setSaving(true);
		try {
			await saveNote(githubToken, {
				folder: folderName,
				filename,
				content: text,
			});
			showToast(`Created ${title.trim()} successfully.`, ToastSeverity.SUCCESS);
			setTitle('');
			setText('');
			setFolder('');
			setIsHidden(true);
			setTouched(emptyTouched);
			onSaved();
		} catch (error) {
			console.error(error);
			showToast(getErrorMessage(error), ToastSeverity.ERROR, error);
		} finally {
			setSaving(false);
		}
	}, [folder, githubToken, onSaved, showToast, text, title]);

	function handleSave() {
		if (!githubToken) {
			onAuthRequired();
			return;
		}
		void performSave();
	}

	function handleClearText() {
		setText('');
	}

	const isNewFolder =
		folder.trim() !== '' &&
		!folders.some(
			(item) => item.name.toLowerCase() === folder.trim().toLowerCase(),
		);

	const noteFilename = title.trim() ? `${title.trim()}.txt` : '';
	const selectedFolder = folders.find(
		(item) => item.name.toLowerCase() === folder.trim().toLowerCase(),
	);
	const isDuplicateNote =
		noteFilename !== '' &&
		(selectedFolder?.noteFilenames.some(
			(name) => name.toLowerCase() === noteFilename.toLowerCase(),
		) ??
			false);

	const titleRequiredError = touched.title && !title.trim();
	const folderRequiredError = touched.folder && !folder.trim();
	const textRequiredError = touched.text && !text.trim();

	const titleError = isDuplicateNote || titleRequiredError;
	const titleHelperText = isDuplicateNote
		? 'This note already exists in this folder.'
		: titleRequiredError
		? 'Title is required.'
		: undefined;

	const folderError = folderRequiredError;
	const folderHelperText = folderRequiredError
		? 'Folder is required.'
		: isNewFolder
		? 'New folder will be created.'
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
			label: saving ? 'Saving…' : 'Save',
			variant: 'contained',
			onClick: handleSave,
			disabled:
				saving ||
				!title.trim() ||
				!text.trim() ||
				!folder.trim() ||
				isDuplicateNote,
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
				sx={{
					display: 'flex',
					flexDirection: { xs: 'column', sm: 'row' },
					gap: 2,
					minWidth: 0,
					alignItems: { xs: 'stretch', sm: 'start' },
				}}
			>
				<StandardTextField
					id='note-title'
					label='Title'
					value={title}
					onChange={(e) => setTitle(e.target.value)}
					onBlur={() => markTouched('title')}
					sx={{ flex: { sm: 1 }, minWidth: 0, width: '100%' }}
					size='small'
					required
					error={titleError}
					helperText={titleHelperText}
				/>
				<StandardAutocomplete
					id='note-folder'
					label='Folder'
					value={folder}
					onChange={setFolder}
					onBlur={() => markTouched('folder')}
					options={folderOptions}
					error={folderError}
					helperText={folderHelperText}
					sx={{ flex: { sm: 1 }, minWidth: 0, width: '100%' }}
					required
				/>
				<StandardCheckbox
					label='Hidden'
					checked={isHidden}
					onChange={setIsHidden}
				/>
			</Box>
			<ActionToolbar actions={{ end: textToolbarActions }} sx={{ justifyContent: 'flex-end' }} />
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
