import React from 'react';
import { FormPanel } from '../FormPanel/FormPanel';
import { StandardModal } from '../StandardModal/StandardModal';
import type { ActionConfig } from '../../../types/basic.types';

interface ConfirmationModalProps {
	open: boolean;
	onClose: () => void;
	onConfirm: () => void;
	title: string;
	message: React.ReactNode;
	confirmLabel?: string;
	cancelLabel?: string;
	/** When true, the confirm button uses the danger/error colour palette. */
	danger?: boolean;
}

function ConfirmationModal({
	open,
	onClose,
	onConfirm,
	title,
	message,
	confirmLabel = 'Confirm',
	cancelLabel = 'Cancel',
	danger = false,
}: ConfirmationModalProps) {
	const footerActions: ActionConfig[] = [
		{ id: 'cancel', label: cancelLabel, variant: 'outlined', onClick: onClose },
		{
			id: 'confirm',
			label: confirmLabel,
			variant: 'contained',
			onClick: onConfirm,
			color: danger ? 'danger' : undefined,
		},
	];

	return (
		<StandardModal open={open} onClose={onClose}>
			<FormPanel header={title} footerActions={footerActions}>
				<p style={{ margin: 0 }}>{message}</p>
			</FormPanel>
		</StandardModal>
	);
}

export { ConfirmationModal };
export type { ConfirmationModalProps };
