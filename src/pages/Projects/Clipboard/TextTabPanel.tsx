import React from 'react';
import { StandardTextArea } from '../../../components/controls/StandardTextArea/StandardTextArea';
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
	return (
		<ClipboardTabPanel
			onRefresh={onRefresh}
			onClear={onClear}
			onSave={onSave}
			hasContent={hasContent}
			hasNoChanges={hasNoTextChanges}
			lastUpdated={lastUpdatedText}
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
