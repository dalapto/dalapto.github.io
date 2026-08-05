import {
	TextField as MuiTextField,
	type TextFieldProps as MuiTextFieldProps,
} from '@mui/material';
import React from 'react';
import { colours } from '../../../constants/colours';

function StandardTextField({ InputLabelProps, sx, ...rest }: MuiTextFieldProps) {
	return (
		<MuiTextField
			variant='outlined'
			{...rest}
			InputLabelProps={{
				...InputLabelProps,
				sx: {
					color: colours.textSecondary,
					'&.Mui-focused': { color: colours.secondary },
					'&.MuiInputLabel-shrink': {
						backgroundColor: colours.primary,
						px: 0.5,
					},
					...InputLabelProps?.sx,
				},
			}}
			sx={{
				'& .MuiOutlinedInput-root': {
					color: colours.text,
					'& fieldset': { borderColor: colours.textSecondary },
					'&:hover fieldset': { borderColor: colours.secondary },
					'&.Mui-focused fieldset': { borderColor: colours.secondary },
				},
				...sx,
			}}
		/>
	);
}

export { StandardTextField };
