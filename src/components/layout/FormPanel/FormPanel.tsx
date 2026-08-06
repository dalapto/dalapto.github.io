import { Box, type SxProps, type Theme } from '@mui/material';
import React from 'react';
import { renderActions } from '../../controls/ActionButton/ActionButton';
import type { ActionConfig, HeaderActions } from '../../../types/basic.types';
import { resolveHeaderActions } from '../../../types/basic.types';

interface FormPanelProps {
	header?: string;
	headerActions?: HeaderActions;
	children: React.ReactNode;
	footerActions?: HeaderActions;
	/** Override or extend the outer Box styles. */
	sx?: SxProps<Theme>;
}

const actionButtonSx = {
	'& .MuiButton-root': {
		fontSize: { xs: '0.8125rem', sm: '0.875rem' },
		px: { xs: 1.5, sm: 2 },
		py: { xs: 1, sm: 1 },
		minWidth: { xs: 'unset', sm: 64 },
		flexShrink: 0,
	},
	'& .MuiButton-startIcon': {
		marginRight: { xs: 0.5, sm: 1 },
		'& > svg': { fontSize: { xs: '1.125rem', sm: '1.25rem' } },
	},
} as const;

function ActionGroup({ actions }: { actions: ActionConfig[] }) {
	if (actions.length === 0) return null;
	return (
		<Box
			sx={{
				display: 'flex',
				flexWrap: { xs: 'nowrap', sm: 'wrap' },
				gap: { xs: 0.5, sm: 1 },
				flexShrink: 0,
			}}
		>
			{renderActions(actions)}
		</Box>
	);
}

function FormPanel({
	header,
	headerActions,
	children,
	footerActions,
	sx,
}: FormPanelProps) {
	const { start: headerStart, end: headerEnd } = resolveHeaderActions(headerActions);
	const { start: footerStart, end: footerEnd } = resolveHeaderActions(footerActions);
	const hasToolbar = headerStart.length > 0 || headerEnd.length > 0;
	const hasFooter = footerStart.length > 0 || footerEnd.length > 0;
	const footerJustify =
		footerStart.length > 0 && footerEnd.length > 0
			? 'space-between'
			: footerEnd.length > 0
				? 'flex-end'
				: 'flex-start';

	return (
		<Box
			sx={[
				{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 },
				...(Array.isArray(sx) ? sx : [sx]),
			]}
		>
			{header && (
				<Box component='h2' sx={{ m: 0, fontSize: '1.25rem', fontWeight: 'bold' }}>
					{header}
				</Box>
			)}

			{hasToolbar && (
				<Box
					sx={{
						display: 'flex',
						flexWrap: { xs: 'nowrap', sm: 'wrap' },
						justifyContent: 'space-between',
						alignItems: 'center',
						gap: { xs: 0.5, sm: 1 },
						...actionButtonSx,
					}}
				>
					<ActionGroup actions={headerStart} />
					<ActionGroup actions={headerEnd} />
				</Box>
			)}

			<Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, minWidth: 0 }}>
				{children}
			</Box>

			{hasFooter && (
				<Box
					sx={{
						display: 'flex',
						justifyContent: footerJustify,
						gap: { xs: 0.5, sm: 1 },
						...actionButtonSx,
					}}
				>
					<ActionGroup actions={footerStart} />
					<ActionGroup actions={footerEnd} />
				</Box>
			)}
		</Box>
	);
}

export { FormPanel };
export type { FormPanelProps };
