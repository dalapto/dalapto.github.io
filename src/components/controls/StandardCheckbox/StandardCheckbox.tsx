import {
	Checkbox,
	FormControlLabel,
	type SxProps,
	type Theme,
} from '@mui/material';
import React from 'react';
import { colours } from '../../../constants/colours';
import './StandardCheckbox.css';

interface StandardCheckboxProps {
	id?: string;
	label: string;
	checked: boolean;
	onChange: (checked: boolean) => void;
	className?: string;
	sx?: SxProps<Theme>;
}

function StandardCheckbox({
	id,
	label,
	checked,
	onChange,
	className,
	sx,
}: StandardCheckboxProps) {
	return (
		<FormControlLabel
			label={label}
			className={['standard-checkbox', className].filter(Boolean).join(' ')}
			control={
				<Checkbox
					id={id}
					checked={checked}
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
