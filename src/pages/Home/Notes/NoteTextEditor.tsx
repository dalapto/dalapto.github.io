import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import type { SxProps, Theme } from '@mui/material';
import { StandardTextArea } from '../../../components/controls/StandardTextArea/StandardTextArea';
import { ActionToolbar } from '../../../components/layout/FormPanel/FormPanel';
import { useTextClipboard } from '../../../hooks/useTextClipboard';
import type { ActionConfig } from '../../../types/basic.types';

interface NoteTextEditorProps {
	id: string;
	placeholder: string;
	text: string;
	onTextChange: (value: string) => void;
	onBlur: () => void;
	error: boolean;
	helperText?: string;
	/** Extra toolbar buttons on the left (e.g. Refresh). Copy/Paste are always on the right. */
	startActions?: ActionConfig[];
	toolbarSx?: SxProps<Theme>;
}

/** The note text area with its Copy/Paste toolbar, shared by the Create and Edit panels. */
function NoteTextEditor({
	id,
	placeholder,
	text,
	onTextChange,
	onBlur,
	error,
	helperText,
	startActions,
	toolbarSx,
}: NoteTextEditorProps) {
	const { copy, paste } = useTextClipboard(text, onTextChange);

	const clipboardActions: ActionConfig[] = [
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

	return (
		<>
			<ActionToolbar
				actions={{ start: startActions, end: clipboardActions }}
				sx={toolbarSx}
			/>
			<StandardTextArea
				id={id}
				name={id}
				placeholder={placeholder}
				value={text}
				onChange={onTextChange}
				onBlur={onBlur}
				error={error}
				helperText={helperText}
				required
			/>
		</>
	);
}

export { NoteTextEditor };
