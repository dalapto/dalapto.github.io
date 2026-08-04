import { Paper } from '@mui/material';
import React from 'react';
import { StandardButton } from '../../controls/StandardButton/StandardButton';

interface ActionsPanelProps {
	onRefresh: () => void;
	leadingActions?: React.ReactNode;
	actions?: React.ReactNode;
	children: React.ReactNode;
}

function ActionsPanel({ onRefresh, leadingActions, actions, children }: ActionsPanelProps) {
	return (
		<Paper
			elevation={0}
			sx={{
				minWidth: { xs: '80vw', sm: '50vw' },
				maxWidth: { xs: '80vw', sm: '50vw' },
				minHeight: '60vh',
				p: 2,
				display: 'flex',
				flexDirection: 'column',
				gap: 2,
				backgroundColor: 'transparent',
				color: 'inherit',
				overflow: 'hidden',
			}}
		>
			<div
				style={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
				}}
			>
				<div style={{ display: 'flex', gap: '0.5rem' }}>
					<StandardButton variant='outlined' onClick={onRefresh}>
						Refresh
					</StandardButton>
					{leadingActions}
				</div>
				{actions && (
					<div style={{ display: 'flex', gap: '0.5rem' }}>{actions}</div>
				)}
			</div>
			<div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
				{children}
			</div>
		</Paper>
	);
}

export { ActionsPanel };
