import { Box, useMediaQuery, useTheme } from '@mui/material';
import React from 'react';
import type { ActionConfig } from '../../../types/basic.types';
import type { ButtonColor } from '../StandardButton/StandardButton';
import { StandardButton } from '../StandardButton/StandardButton';

interface ActionButtonProps {
	label: string;
	onClick: () => void;
	variant: 'outlined' | 'contained';
	disabled?: boolean;
	icon?: React.ReactElement;
	/** When true (default with icon), only the icon shows on mobile. Set false to keep label + icon. */
	mobileIconOnly?: boolean;
	color?: ButtonColor;
}

function renderActions(configs: ActionConfig[]): React.ReactNode {
	return configs
		.filter((c) => !c.hidden)
		.map((c) => (
			<ActionButton
				key={c.id}
				label={c.label}
				variant={c.variant}
				onClick={c.onClick}
				disabled={c.disabled}
				icon={c.icon}
				mobileIconOnly={c.mobileIconOnly}
				color={c.color}
			/>
		));
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

const iconOnlySx = {
	minWidth: 'unset',
	px: 1.25,
	display: 'inline-flex',
	alignItems: 'center',
	justifyContent: 'center',
};

function ActionButton({
	label,
	onClick,
	variant,
	disabled = false,
	icon,
	mobileIconOnly = Boolean(icon),
	color,
}: ActionButtonProps) {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
	const hideLabelOnMobile = Boolean(icon) && mobileIconOnly && isMobile;

	const labelContent =
		icon && mobileIconOnly ? (
			<Box component='span' sx={{ display: { xs: 'none', sm: 'inline' } }}>
				{label}
			</Box>
		) : (
			label
		);

	if (hideLabelOnMobile && icon) {
		return (
			<StandardButton
				variant={variant}
				onClick={onClick}
				disabled={disabled}
				color={color}
				props={{ 'aria-label': label, sx: iconOnlySx }}
			>
				{icon}
			</StandardButton>
		);
	}

	return (
		<StandardButton
			variant={variant}
			onClick={onClick}
			disabled={disabled}
			color={color}
			props={icon ? { startIcon: icon, 'aria-label': label } : undefined}
		>
			{labelContent}
		</StandardButton>
	);
}

export { ActionButton, actionButtonSx, renderActions };
export type { ActionButtonProps };
