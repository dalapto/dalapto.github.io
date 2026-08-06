import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { Box, IconButton, Tooltip } from '@mui/material';
import React from 'react';
import { colours } from '../../constants/colours';

interface AuthIconButtonProps {
	user: { login?: string | null; email?: string | null } | null;
	authLoading: boolean;
	onClick: () => void;
	inline?: boolean;
}

function AuthIconButton({
	user,
	authLoading,
	onClick,
	inline = false,
}: AuthIconButtonProps) {
	return (
		<Tooltip title={user ? 'Account' : 'Sign in required to save changes'} placement='bottom' arrow>
			<IconButton
				aria-label={user ? 'Account' : 'Sign in required'}
				onClick={onClick}
				sx={{
					...(inline
						? {
								color: colours.text,
								p: 0.25,
							}
						: {
								position: 'absolute',
								top: 8,
								right: 8,
								zIndex: 10,
								color: colours.text,
							}),
				}}
			>
				<Box sx={{ position: 'relative', display: 'inline-flex', lineHeight: 0 }}>
					<AccountCircleIcon sx={inline ? { fontSize: '1.25rem' } : undefined} />
					{!authLoading &&
						(user ? (
							<CheckCircleIcon
								sx={{
									position: 'absolute',
									right: -1.5,
									bottom: -4,
									fontSize: '0.8rem',
									color: colours.success,
									bgcolor: colours.primary,
									borderRadius: '50%',
								}}
							/>
						) : (
							<WarningAmberIcon
								sx={{
									position: 'absolute',
									right: -1.5,
									bottom: -3,
									fontSize: '0.8rem',
									color: colours.warning,
									bgcolor: colours.primary,
									borderRadius: '50%',
								}}
							/>
						))}
				</Box>
			</IconButton>
		</Tooltip>
	);
}

export { AuthIconButton };
