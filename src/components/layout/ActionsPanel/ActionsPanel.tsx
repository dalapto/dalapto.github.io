import RefreshIcon from '@mui/icons-material/Refresh';
import { Box, Paper } from '@mui/material';
import React from 'react';
import { ActionButton } from '../../controls/ActionButton/ActionButton';

interface ActionsPanelProps {
	onRefresh: () => void;
	leadingActions?: React.ReactNode;
	actions?: React.ReactNode;
	children: React.ReactNode;
}

function ActionsPanel({
	onRefresh,
	leadingActions,
	actions,
	children,
}: ActionsPanelProps) {
	return (
		<Paper
			elevation={0}
			sx={{
				minWidth: { xs: '80vw', sm: '50vw' },
				maxWidth: { xs: '80vw', sm: '50vw' },
				p: 2,
				display: 'flex',
				flexDirection: 'column',
				gap: 2,
				backgroundColor: 'transparent',
				color: 'inherit',
			}}
		>
			<Box
				sx={{
					display: 'flex',
					flexWrap: { xs: 'nowrap', sm: 'wrap' },
					justifyContent: 'space-between',
					alignItems: 'center',
					gap: { xs: 0.5, sm: 1 },
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
				}}
			>
				<Box
					sx={{
						display: 'flex',
						flexWrap: { xs: 'nowrap', sm: 'wrap' },
						gap: { xs: 0.5, sm: 1 },
						minWidth: 0,
					}}
				>
					<ActionButton
						label='Refresh'
						icon={<RefreshIcon />}
						variant='outlined'
						onClick={onRefresh}
					/>
					{leadingActions}
				</Box>
				{actions && (
					<Box
						sx={{
							display: 'flex',
							flexWrap: { xs: 'nowrap', sm: 'wrap' },
							gap: { xs: 0.5, sm: 1 },
							flexShrink: 0,
						}}
					>
						{actions}
					</Box>
				)}
			</Box>
			<Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, minWidth: 0 }}>
				{children}
			</Box>
		</Paper>
	);
}

export { ActionsPanel };
