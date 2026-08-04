import { Button } from '@mui/material';
import React from 'react';
import { colours } from '../../../constants/colours';

interface StandardButtonProps {
	onClick?: () => void;
	disabled?: boolean;
	variant: 'outlined' | 'contained';
	children: React.ReactNode;
}

function StandardButton({
	onClick,
	disabled = false,
	variant,
	children,
}: StandardButtonProps) {
	if (variant === 'outlined') {
		return (
			<Button
				onClick={onClick}
				disabled={disabled}
				variant='outlined'
				size='large'
				sx={{
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
				}}
			>
				{children}
			</Button>
		);
	}

	return (
		<Button
			onClick={onClick}
			disabled={disabled}
			variant='contained'
			size='large'
			sx={{
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
			}}
		>
			{children}
		</Button>
	);
}

export { StandardButton };
