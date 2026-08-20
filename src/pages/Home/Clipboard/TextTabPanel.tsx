import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import React from 'react';
import { StandardTextArea } from '../../../components/controls/StandardTextArea/StandardTextArea';
import { useAuthRequest } from '../../../context/AuthRequestContext';
import { useSupabase } from '../../../context/SupabaseContext';
import { useTextClipboard } from '../../../hooks/useTextClipboard';
import type { HeaderActions } from '../../../types/basic.types';
import { ClipboardTabPanel } from './ClipboardTabPanel';

interface TextTabPanelProps {
	textContent: string;
	onTextChange: (value: string) => void;
	lastUpdatedText: Date;
	hasContent: boolean;
	hasNoTextChanges: boolean;
	onClear: () => void;
	onSave: () => void;
	onRefresh: () => void;
}

function TextTabPanel({
	textContent,
	onTextChange,
	lastUpdatedText,
	hasContent,
	hasNoTextChanges,
	onClear,
	onSave,
	onRefresh,
}: TextTabPanelProps) {
	const { copy, paste } = useTextClipboard(textContent, onTextChange);
	const { user } = useSupabase();
	const { requestAuth } = useAuthRequest();

	function handleSave() {
		if (!user) {
			requestAuth();
		}
		void onSave();
	}

	const headerEndActions = [
		{
			id: 'copy',
			label: 'Copy',
			variant: 'outlined' as const,
			icon: <ContentCopyIcon />,
			onClick: copy,
			disabled: !hasContent,
		},
		{
			id: 'paste',
			label: 'Paste',
			variant: 'contained' as const,
			icon: <ContentPasteIcon />,
			onClick: paste,
			mobileIconOnly: false,
		},
	];

	const footerActions: HeaderActions = {
		end: [
			{
				id: 'clear',
				label: 'Clear',
				variant: 'outlined',
				onClick: onClear,
				hidden: !hasContent,
			},
			{
				id: 'save',
				label: 'Save',
				variant: 'contained',
				onClick: handleSave,
				disabled: user ? hasNoTextChanges : !hasContent,
			},
		],
	};

	return (
		<ClipboardTabPanel
			onRefresh={onRefresh}
			onClear={onClear}
			onSave={onSave}
			hasContent={hasContent}
			hasNoChanges={hasNoTextChanges}
			lastUpdated={lastUpdatedText}
			headerEndActions={headerEndActions}
			footerActions={footerActions}
		>
			<StandardTextArea
				id='textpaste'
				name='textpaste'
				placeholder=' Paste text in here...'
				value={textContent}
				onChange={onTextChange}
			/>
		</ClipboardTabPanel>
	);
}

export { TextTabPanel };
