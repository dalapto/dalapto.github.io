import CloseIcon from '@mui/icons-material/Close';
import { Dialog, DialogContent, IconButton } from '@mui/material';
import React from 'react';

interface LightboxProps {
	open: boolean;
	onClose: () => void;
	children: React.ReactNode;
	backdropOpacity?: number;
}

function Lightbox({
	open,
	onClose,
	children,
	backdropOpacity = 0.85,
}: LightboxProps) {
	return (
		<Dialog
			open={open}
			onClose={onClose}
			maxWidth='lg'
			fullWidth
			disableScrollLock
			slotProps={{
				backdrop: { sx: { backgroundColor: `rgba(0,0,0,${backdropOpacity})` } },
			}}
		>
			<DialogContent sx={{ p: 0, position: 'relative', bgcolor: '#111' }}>
				<IconButton
					onClick={onClose}
					sx={{
						position: 'absolute',
						top: 8,
						right: 8,
						zIndex: 1,
						color: '#fff',
					}}
				>
					<CloseIcon />
				</IconButton>
				{children}
			</DialogContent>
		</Dialog>
	);
}

export { Lightbox };
