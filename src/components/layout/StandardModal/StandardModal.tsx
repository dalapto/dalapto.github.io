import { Dialog, useMediaQuery, useTheme } from '@mui/material';
import React from 'react';
import { colours } from '../../../constants/colours';

interface StandardModalProps {
	open: boolean;
	onClose: () => void;
	children: React.ReactNode;
	maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

function StandardModal({
	open,
	onClose,
	children,
	maxWidth = 'xs',
}: StandardModalProps) {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

	return (
		<Dialog
			open={open}
			onClose={onClose}
			maxWidth={maxWidth}
			fullWidth
			fullScreen={isMobile}
			PaperProps={{
				sx: {
					bgcolor: colours.primary,
					color: colours.text,
				},
			}}
		>
			{children}
		</Dialog>
	);
}

export { StandardModal };
export type { StandardModalProps };
