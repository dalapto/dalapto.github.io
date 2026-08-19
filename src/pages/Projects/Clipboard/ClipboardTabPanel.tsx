import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import RefreshIcon from '@mui/icons-material/Refresh';
import UploadIcon from '@mui/icons-material/Upload';
import { Box } from '@mui/material';
import React from 'react';
import {
	ActionToolbar,
	FormPanel,
} from '../../../components/layout/FormPanel/FormPanel';
import { useAuthRequest } from '../../../context/AuthRequestContext';
import { useSupabase } from '../../../context/SupabaseContext';
import type { ActionConfig, HeaderActions } from '../../../types/basic.types';
import {
	ClipboardContentMeta,
	ClipboardExpiry,
	ClipboardLastUpdated,
} from './ClipboardContentMeta';

interface ClipboardTabPanelProps {
	onRefresh: () => void;
	onClear: () => void;
	onSave: () => void;
	hasContent: boolean;
	hasNoChanges: boolean;
	lastUpdated: Date;
	/** When provided, an Upload button is added to the start of the toolbar. */
	onUpload?: () => void;
	/** When provided, a Paste button is added after Upload in the toolbar. */
	onPaste?: () => void;
	/** When provided with footerActions, replaces Clear/Save in the header end. */
	headerEndActions?: ActionConfig[];
	footerActions?: HeaderActions;
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
	onPaste,
	headerEndActions,
	footerActions,
	children,
}: ClipboardTabPanelProps) {
	const { user } = useSupabase();
	const { requestAuth } = useAuthRequest();

	function handleSave() {
		if (!user) {
			requestAuth();
		}
		void onSave();
	}

	const defaultHeaderEnd: ActionConfig[] = [
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
			disabled: user ? hasNoChanges : !hasContent,
		},
	];

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
			...(onPaste
				? [
						{
							id: 'paste',
							label: 'Paste',
							variant: 'contained' as const,
							icon: <ContentPasteIcon />,
							onClick: onPaste,
							mobileIconOnly: false,
						},
				  ]
				: []),
		],
		end: footerActions ? headerEndActions ?? [] : defaultHeaderEnd,
	};

	return (
		<FormPanel
			headerActions={headerActions}
			sx={{
				minWidth: { xs: '80vw', sm: '50vw' },
				maxWidth: { xs: '80vw', sm: '50vw' },
			}}
		>
			{children}
			{footerActions ? (
				<Box
					sx={{
						display: 'flex',
						flexDirection: { xs: 'column', sm: 'row' },
						alignItems: { xs: 'stretch', sm: 'center' },
						gap: 1,
					}}
				>
					<Box
						sx={{
							order: { xs: 2, sm: 1 },
							flex: { sm: 1 },
							minWidth: 0,
							display: 'flex',
							flexDirection: 'column',
							gap: 0.25,
						}}
					>
						<ClipboardLastUpdated lastUpdated={lastUpdated} />
						<Box sx={{ display: { xs: 'block', sm: 'none' } }}>
							<ClipboardExpiry
								lastUpdated={lastUpdated}
								hasContent={hasContent}
								hasNoChanges={hasNoChanges}
							/>
						</Box>
					</Box>
					<Box
						sx={{
							order: { xs: 3, sm: 2 },
							flex: { sm: 1 },
							display: { xs: 'none', sm: 'flex' },
							justifyContent: 'center',
							minWidth: 0,
						}}
					>
						<ClipboardExpiry
							lastUpdated={lastUpdated}
							hasContent={hasContent}
							hasNoChanges={hasNoChanges}
						/>
					</Box>
					<ActionToolbar
						actions={footerActions}
						sx={{
							order: { xs: 1, sm: 3 },
							flex: { sm: 1 },
							flexWrap: 'nowrap',
							justifyContent: 'flex-end',
						}}
					/>
				</Box>
			) : (
				<ClipboardContentMeta
					lastUpdated={lastUpdated}
					hasContent={hasContent}
					hasNoChanges={hasNoChanges}
				/>
			)}
		</FormPanel>
	);
}

export { ClipboardTabPanel };
export type { ClipboardTabPanelProps };
