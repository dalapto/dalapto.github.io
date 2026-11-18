import {
	Checkbox,
	FormControlLabel,
	type SxProps,
	type Theme,
} from '@mui/material';
import { colours } from '../../../constants/colours';
import './StandardCheckbox.css';

interface StandardCheckboxProps {
	id?: string;
	label: string;
	checked: boolean;
	onChange: (checked: boolean) => void;
	disabled?: boolean;
	className?: string;
	sx?: SxProps<Theme>;
}

function StandardCheckbox({
	id,
	label,
	checked,
	onChange,
	disabled = false,
	className,
	sx,
}: StandardCheckboxProps) {
	return (
		<FormControlLabel
			label={label}
			disabled={disabled}
			className={['standard-checkbox', className].filter(Boolean).join(' ')}
			control={
				<Checkbox
					id={id}
					checked={checked}
					disabled={disabled}
					onChange={(e) => onChange(e.target.checked)}
					sx={{
						color: colours.textSecondary,
						'&.Mui-checked': { color: colours.secondary },
					}}
				/>
			}
			sx={{
				color: colours.textSecondary,
				...sx,
			}}
		/>
	);
}

export { StandardCheckbox };
