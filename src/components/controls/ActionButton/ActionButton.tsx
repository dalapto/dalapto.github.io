import { Box, useMediaQuery, useTheme } from '@mui/material';
import React from 'react';
import type { ActionConfig } from '../../../types/basic.types';
import { StandardButton } from '../StandardButton/StandardButton';

interface ActionButtonProps {
	label: string;
	onClick: () => void;
	variant: 'outlined' | 'contained';
	disabled?: boolean;
	icon?: React.ReactElement;
	/** Hide label on mobile when an icon is set. Defaults to true if icon is provided. */
	mobileIconOnly?: boolean;
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
			/>
		));
}

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
				props={{
					'aria-label': label,
					sx: iconOnlySx,
				}}
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
			props={
				icon
					? {
							startIcon: icon,
							'aria-label': label,
						}
					: undefined
			}
		>
			{labelContent}
		</StandardButton>
	);
}

export { ActionButton, renderActions };
export type { ActionButtonProps };
