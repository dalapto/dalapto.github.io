import { Button, ButtonProps } from '@mui/material';
import React from 'react';
import { colours } from '../../../constants/colours';

interface StandardButtonProps {
	onClick?: () => void;
	disabled?: boolean;
	variant: 'outlined' | 'contained';
	children: React.ReactNode;
	props?: ButtonProps;
}

function StandardButton({
	onClick,
	disabled = false,
	variant,
	children,
	props,
}: StandardButtonProps) {
	const { sx: propSx, ...buttonProps } = props ?? {};

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
