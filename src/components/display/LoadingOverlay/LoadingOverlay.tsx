import {
	CircularProgress,
	Dialog,
	DialogContent,
	LinearProgress,
	Typography,
} from '@mui/material';
import React from 'react';
import { colours } from '../../../constants/colours';

type LoadingVariant = 'spinner' | 'progress';

interface LoadingOverlayProps {
	open: boolean;
	title?: string;
	subtitle?: string;
	variant?: LoadingVariant;
}

function LoadingOverlay({
	open,
	title = 'Please wait',
	subtitle,
	variant = 'spinner',
}: LoadingOverlayProps) {
	return (
		<Dialog
			open={open}
			disableEscapeKeyDown
			aria-labelledby='loading-overlay-title'
			aria-describedby='loading-overlay-subtitle'
			PaperProps={{
				sx: {
					bgcolor: colours.primary,
					color: colours.text,
					minWidth: '16rem',
					maxWidth: '22rem',
				},
			}}
			slotProps={{
				backdrop: {
					sx: { bgcolor: 'rgba(0, 0, 0, 0.55)' },
				},
			}}
		>
			<DialogContent
				sx={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					gap: '1.25rem',
					py: '2rem',
					px: '2rem',
					textAlign: 'center',
				}}
			>
				{variant === 'spinner' ? (
					<CircularProgress
						size={48}
						sx={{ color: colours.secondary }}
						aria-hidden
					/>
				) : (
					<LinearProgress
						sx={{
							width: '100%',
							height: 6,
							borderRadius: 3,
							bgcolor: colours.disabledBg,
							'& .MuiLinearProgress-bar': {
								bgcolor: colours.secondary,
							},
						}}
						aria-hidden
					/>
				)}
				<div>
					<Typography
						id='loading-overlay-title'
						variant='h6'
						component='p'
						sx={{ color: colours.text, mb: '0.35rem' }}
					>
						{title}
					</Typography>
					{subtitle && (
						<Typography
							id='loading-overlay-subtitle'
							variant='body2'
							sx={{ color: colours.textSecondary }}
						>
							{subtitle}
						</Typography>
					)}
				</div>
			</DialogContent>
		</Dialog>
	);
}

export { LoadingOverlay };
export type { LoadingOverlayProps, LoadingVariant };
