import RefreshIcon from '@mui/icons-material/Refresh';
import UploadIcon from '@mui/icons-material/Upload';
import React from 'react';
import { FormPanel } from '../../../components/layout/FormPanel/FormPanel';
import type { HeaderActions } from '../../../types/basic.types';
import { ClipboardContentMeta } from './ClipboardContentMeta';

interface ClipboardTabPanelProps {
	onRefresh: () => void;
	onClear: () => void;
	onSave: () => void;
	hasContent: boolean;
	hasNoChanges: boolean;
	lastUpdated: Date;
	/** When provided, an Upload button is added to the start of the toolbar. */
	onUpload?: () => void;
	children: React.ReactNode;
}

function ClipboardTabPanel({
	onRefresh,
	onClear,
	onSave,
	hasContent,
	hasNoChanges,
	lastUpdated,
	onUpload,
	children,
}: ClipboardTabPanelProps) {
	const headerActions: HeaderActions = {
		start: [
			{
				id: 'refresh',
				label: 'Refresh',
				variant: 'outlined',
				icon: <RefreshIcon />,
				onClick: onRefresh,
			},
			...(onUpload
				? [
						{
							id: 'upload',
							label: 'Upload',
							variant: 'contained' as const,
							icon: <UploadIcon />,
							onClick: onUpload,
						},
					]
				: []),
		],
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
				onClick: onSave,
				disabled: hasNoChanges,
			},
		],
	};

	return (
		<FormPanel
			headerActions={headerActions}
			sx={{ minWidth: { xs: '80vw', sm: '50vw' }, maxWidth: { xs: '80vw', sm: '50vw' } }}
		>
			{children}
			<ClipboardContentMeta lastUpdated={lastUpdated} hasContent={hasContent} />
		</FormPanel>
	);
}

export { ClipboardTabPanel };
export type { ClipboardTabPanelProps };
