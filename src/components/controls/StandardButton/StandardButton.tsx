import { Button, ButtonProps } from '@mui/material';
import React from 'react';
import { colours } from '../../../constants/colours';

type ButtonColor = 'danger' | 'success' | 'warning' | 'info';

interface StandardButtonProps {
	onClick?: () => void;
	disabled?: boolean;
	variant: 'outlined' | 'contained';
	children: React.ReactNode;
	/** Semantic colour override. When omitted the default orange theme is used. */
	color?: ButtonColor;
	props?: ButtonProps;
}

/** Background colours for each semantic variant (all pass WCAG AA with colours.primary text). */
const semanticBg: Record<ButtonColor, string> = {
	danger:  colours.error,   // #ff6b6b — ~5.0:1 on primary
	success: colours.success, // #4caf50 — ~5.2:1 on primary
	warning: colours.warning, // #ffc107 — ~7.9:1 on primary
	info:    colours.info,    // #64b5f6 — ~6.4:1 on primary
};

function getColorSx(color: ButtonColor, variant: 'outlined' | 'contained') {
	const bg = semanticBg[color];
	if (variant === 'outlined') {
		return {
			borderColor: bg,
			color: bg,
			'&:hover': { borderColor: bg, backgroundColor: 'transparent', opacity: 0.85 },
			'&.Mui-disabled': { borderColor: colours.disabledColor, color: colours.disabledColor },
		};
	}
	return {
		backgroundColor: bg,
		color: colours.primary,
		'&:hover': { backgroundColor: bg, boxShadow: 'none', opacity: 0.85 },
		'&.Mui-disabled': { backgroundColor: colours.disabledBg, color: colours.disabledColor },
	};
}

function StandardButton({
	onClick,
	disabled = false,
	variant,
	children,
	color,
	props,
}: StandardButtonProps) {
	const { sx: propSx, ...buttonProps } = props ?? {};
	const colorSx = color ? getColorSx(color, variant) : {};

	const outlinedSx = {
		fontWeight: 'bold',
		borderColor: colours.secondary,
		color: colours.secondary,
		backgroundColor: 'transparent',
		'&:hover': {
			borderColor: colours.secondary,
			backgroundColor: 'transparent',
			opacity: 0.85,
		},
		'&.Mui-disabled': {
			borderColor: colours.disabledColor,
			color: colours.disabledColor,
			backgroundColor: 'transparent',
		},
		...colorSx,
		...propSx,
	};

	const containedSx = {
		fontWeight: 'bold',
		backgroundColor: colours.secondary,
		color: colours.primary,
		boxShadow: 'none',
		'&:hover': {
			backgroundColor: colours.secondary,
			boxShadow: 'none',
			opacity: 0.85,
		},
		'&.Mui-disabled': {
			backgroundColor: colours.disabledBg,
			color: colours.disabledColor,
		},
		...colorSx,
		...propSx,
	};

	if (variant === 'outlined') {
		return (
			<Button
				{...buttonProps}
				onClick={onClick}
				disabled={disabled}
				variant='outlined'
				size='large'
				sx={outlinedSx}
			>
				{children}
			</Button>
		);
	}

	return (
		<Button
			{...buttonProps}
			onClick={onClick}
			disabled={disabled}
			variant='contained'
			size='large'
			sx={containedSx}
		>
			{children}
		</Button>
	);
}

export { StandardButton };
export type { ButtonColor };
