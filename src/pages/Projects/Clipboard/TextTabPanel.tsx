import React from 'react';
import { StandardButton } from '../../../components/controls/StandardButton/StandardButton';
import { ActionsPanel } from '../../../components/layout/ActionsPanel/ActionsPanel';
import { useSaving } from '../../../context/SavingContext';
import { ClipboardContentMeta } from './ClipboardContentMeta';

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
	const { saving } = useSaving();
	return (
		<ActionsPanel
			onRefresh={onRefresh}
			actions={
				<>
					{hasContent && (
						<StandardButton
							variant='outlined'
							disabled={saving}
							onClick={onClear}
						>
							Clear
						</StandardButton>
					)}
					<StandardButton
						variant='contained'
						disabled={hasNoTextChanges || saving}
						onClick={onSave}
					>
						Save
					</StandardButton>
				</>
			}
		>
			<textarea
				id='textpaste'
				name='textpaste'
				placeholder=' Paste text in here...'
				value={textContent}
				onChange={(e) => onTextChange(e.target.value)}
				style={{
					width: '100%',
					minWidth: '100%',
					minHeight: '30em',
					boxSizing: 'border-box',
					resize: 'vertical',
				}}
			/>
			<ClipboardContentMeta
				lastUpdated={lastUpdatedText}
				hasContent={hasContent}
			/>
		</ActionsPanel>
	);
}

export { TextTabPanel };
