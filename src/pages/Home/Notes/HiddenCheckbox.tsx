import RefreshIcon from '@mui/icons-material/Refresh';
import { Box, CircularProgress, IconButton, Tooltip } from '@mui/material';
import { StandardCheckbox } from '../../../components/controls/StandardCheckbox/StandardCheckbox';
import { colours } from '../../../constants/colours';
import type { HiddenStatus } from '../../../hooks/usePointerGistHidden';

interface HiddenCheckboxProps {
	checked: boolean;
	onChange: (checked: boolean) => void;
	status: HiddenStatus;
	onRetry: () => void;
}

/**
 * The article "Hidden" toggle. Disabled while the stored value is unknown
 * (loading or failed), with a retry button on failure.
 */
function HiddenCheckbox({ checked, onChange, status, onRetry }: HiddenCheckboxProps) {
	return (
		<Box sx={{ display: 'inline-flex', alignItems: 'center' }}>
			<StandardCheckbox
				label='Hidden'
				checked={checked}
				onChange={onChange}
				disabled={status !== 'known'}
			/>
			{status === 'loading' && (
				<CircularProgress
					size={14}
					aria-label='Loading visibility'
					sx={{ color: colours.textSecondary }}
				/>
			)}
			{status === 'error' && (
				<Tooltip
					title="Couldn't load this article's visibility. Saving is paused. Click to retry."
					arrow
				>
					<IconButton
						size='small'
						aria-label='Retry loading visibility'
						onClick={onRetry}
						sx={{ color: colours.warning }}
					>
						<RefreshIcon fontSize='small' />
					</IconButton>
				</Tooltip>
			)}
		</Box>
	);
}

export { HiddenCheckbox };
