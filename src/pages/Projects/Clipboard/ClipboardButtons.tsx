import UploadIcon from '@mui/icons-material/Upload';
import React from 'react';
import { ActionButton } from '../../../components/controls/ActionButton/ActionButton';
import { useSaving } from '../../../context/SavingContext';

interface ClipboardUploadButtonProps {
	onClick: () => void;
}

function ClipboardUploadButton({ onClick }: ClipboardUploadButtonProps) {
	return (
		<ActionButton
			label='Upload'
			icon={<UploadIcon />}
			variant='contained'
			onClick={onClick}
		/>
	);
}

interface ClipboardClearButtonProps {
	onClick: () => void;
}

function ClipboardClearButton({ onClick }: ClipboardClearButtonProps) {
	const { saving } = useSaving();

	return (
		<ActionButton
			label='Clear'
			variant='outlined'
			onClick={onClick}
			disabled={saving}
		/>
	);
}

interface ClipboardSaveButtonProps {
	onClick: () => void;
	disabled: boolean;
}

function ClipboardSaveButton({ onClick, disabled }: ClipboardSaveButtonProps) {
	const { saving } = useSaving();

	return (
		<ActionButton
			label='Save'
			variant='contained'
			onClick={onClick}
			disabled={disabled || saving}
		/>
	);
}

interface ClipboardTabActionsProps {
	hasContent: boolean;
	hasNoChanges: boolean;
	onClear: () => void;
	onSave: () => void;
}

function ClipboardTabActions({
	hasContent,
	hasNoChanges,
	onClear,
	onSave,
}: ClipboardTabActionsProps) {
	return (
		<>
			{hasContent && <ClipboardClearButton onClick={onClear} />}
			<ClipboardSaveButton onClick={onSave} disabled={hasNoChanges} />
		</>
	);
}

export {
	ClipboardClearButton,
	ClipboardSaveButton,
	ClipboardTabActions,
	ClipboardUploadButton,
};
