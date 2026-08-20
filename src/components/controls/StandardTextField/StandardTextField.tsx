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
					'&.Mui-error': { color: colours.error },
					'&.MuiInputLabel-shrink': {
						backgroundColor: colours.primary,
						px: 0.5,
					},
					...InputLabelProps?.sx,
				},
			}}
			sx={{
				'&:hover .MuiInputLabel-root:not(.Mui-focused):not(.Mui-error):not(.Mui-disabled)': {
					color: colours.secondary,
				},
				'& .MuiInputLabel-root.Mui-disabled': {
					color: colours.disabledColor,
					opacity: 1,
				},
				'& .MuiOutlinedInput-root': {
					color: colours.text,
					'& fieldset': { borderColor: colours.textSecondary },
					'&:hover fieldset': { borderColor: colours.secondary },
					'&.Mui-focused fieldset': { borderColor: colours.secondary },
					'&:hover input::placeholder': { color: colours.secondary },
					'&.Mui-disabled': {
						opacity: 1,
						color: colours.disabledColor,
						WebkitTextFillColor: colours.disabledColor,
						'& fieldset': { borderColor: colours.disabledColor },
						'& input::placeholder': {
							color: colours.disabledColor,
							opacity: 1,
							WebkitTextFillColor: colours.disabledColor,
						},
					},
				},
				...sx,
			}}
		/>
	);
}

export { StandardTextField };
