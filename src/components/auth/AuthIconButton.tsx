import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { Box } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import type { User } from '@supabase/supabase-js';
import { colours } from '../../constants/colours';

interface AuthIconButtonProps {
	user: User | null;
	authLoading: boolean;
	onClick: () => void;
}

function AuthIconButton({ user, authLoading, onClick }: AuthIconButtonProps) {
	return (
		<IconButton
			aria-label={user ? 'Account' : 'Sign in required'}
			onClick={onClick}
			sx={{
				position: 'absolute',
				top: 8,
				right: 8,
				zIndex: 10,
				color: colours.text,
			}}
		>
			<Box sx={{ position: 'relative', display: 'flex' }}>
				<AccountCircleIcon />
				{!authLoading &&
					(user ? (
						<CheckCircleIcon
							sx={{
								position: 'absolute',
								right: -1.5,
								bottom: -3,
								fontSize: '0.8rem',
								color: '#4caf50',
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
								color: colours.secondary,
								bgcolor: colours.primary,
								borderRadius: '50%',
							}}
						/>
					))}
			</Box>
		</IconButton>
	);
}

export { AuthIconButton };
