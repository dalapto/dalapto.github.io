import { Box, type SxProps, type Theme } from '@mui/material';
import React from 'react';
import { actionButtonSx, renderActions } from '../../controls/ActionButton/ActionButton';
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

function ActionToolbar({ actions, sx }: { actions?: HeaderActions; sx?: SxProps<Theme> }) {
	const { start, startSecondary, end } = resolveHeaderActions(actions);
	if (start.length === 0 && startSecondary.length === 0 && end.length === 0) return null;

	return (
		<Box
			sx={[
				{
					display: 'flex',
					flexWrap: { xs: 'nowrap', sm: 'wrap' },
					justifyContent: 'space-between',
					alignItems: 'center',
					gap: { xs: 0.5, sm: 1 },
					...actionButtonSx,
				},
				...(Array.isArray(sx) ? sx : [sx]),
			]}
		>
			{startSecondary.length > 0 ? (
				<Box
					sx={{
						display: 'flex',
						flexDirection: 'column',
						gap: { xs: 0.5, sm: 1 },
						flexShrink: 0,
					}}
				>
					<ActionGroup actions={start} />
					<ActionGroup actions={startSecondary} />
				</Box>
			) : (
				<ActionGroup actions={start} />
			)}
			<ActionGroup actions={end} />
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
	const { start: footerStart, end: footerEnd } = resolveHeaderActions(footerActions);
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

			<ActionToolbar actions={headerActions} />

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

export { ActionToolbar, FormPanel };
export type { FormPanelProps };
