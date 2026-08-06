import {
	Autocomplete,
	type AutocompleteProps,
	type SxProps,
	type Theme,
} from '@mui/material';
import React from 'react';
import { colours } from '../../../constants/colours';
import { StandardTextField } from '../StandardTextField/StandardTextField';

interface StandardAutocompleteProps {
	id?: string;
	label: string;
	value: string;
	onChange: (value: string) => void;
	options: string[];
	size?: 'small' | 'medium';
	required?: boolean;
	freeSolo?: boolean;
	disabled?: boolean;
	error?: boolean;
	helperText?: string;
	onBlur?: () => void;
	sx?: SxProps<Theme>;
}

function StandardAutocomplete({
	id,
	label,
	value,
	onChange,
	options,
	size = 'small',
	required,
	freeSolo = true,
	disabled,
	error,
	helperText,
	onBlur,
	sx,
}: StandardAutocompleteProps) {
	const autocompleteProps: AutocompleteProps<string, false, false, typeof freeSolo> = {
		freeSolo,
		disabled,
		options,
		inputValue: value,
		onInputChange: (_, newValue) => onChange(newValue),
		onChange: (_, newValue) => onChange(typeof newValue === 'string' ? newValue : ''),
		renderInput: (params) => (
			<StandardTextField
				{...params}
				id={id}
				label={label}
				size={size}
				required={required}
				error={error}
				helperText={helperText}
				onBlur={(event) => {
					params.inputProps.onBlur?.(event as React.FocusEvent<HTMLInputElement>);
					onBlur?.();
				}}
			/>
		),
		slotProps: {
			paper: {
				sx: {
					backgroundColor: colours.primary,
					color: colours.text,
				},
			},
		},
		ListboxProps: {
			sx: {
				'& .MuiAutocomplete-option:hover': {
					backgroundColor: 'rgba(255, 168, 101, 0.12)',
					color: colours.secondary,
				},
				'& .MuiAutocomplete-option[aria-selected="true"]': {
					backgroundColor: 'rgba(255, 168, 101, 0.2)',
				},
			},
		},
		sx: {
			'& .MuiAutocomplete-popupIndicator': { color: colours.textSecondary },
			'&:hover .MuiAutocomplete-popupIndicator': { color: colours.secondary },
			'& .MuiAutocomplete-clearIndicator': { color: colours.textSecondary },
			'&:hover .MuiAutocomplete-clearIndicator': { color: colours.secondary },
			'&.Mui-disabled': {
				opacity: 1,
				'& .MuiAutocomplete-popupIndicator': { color: colours.disabledColor },
				'& .MuiAutocomplete-endAdornment': { opacity: 1 },
			},
			...sx,
		},
	};

	return <Autocomplete {...autocompleteProps} />;
}

export { StandardAutocomplete };
