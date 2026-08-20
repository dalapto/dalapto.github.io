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
	/** When true, selection is from the list only — no typing or inline search. */
	dropdownOnly?: boolean;
	disabled?: boolean;
	error?: boolean;
	helperText?: string;
	onBlur?: () => void;
	onOpen?: () => void;
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
	dropdownOnly = false,
	disabled,
	error,
	helperText,
	onBlur,
	onOpen,
	sx,
}: StandardAutocompleteProps) {
	const isFreeSolo = dropdownOnly ? false : freeSolo;
	const autocompleteProps: AutocompleteProps<string, false, false, typeof isFreeSolo> = {
		freeSolo: isFreeSolo,
		disabled,
		onOpen,
		options,
		...(isFreeSolo
			? {
					inputValue: value,
					onInputChange: (_, newValue) => onChange(newValue),
					onChange: (_, newValue) =>
						onChange(typeof newValue === 'string' ? newValue : ''),
				}
			: {
					value: options.includes(value) ? value : null,
					onChange: (_, newValue) => onChange(newValue ?? ''),
				}),
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
				inputProps={{
					...params.inputProps,
					...(dropdownOnly ? { readOnly: true } : {}),
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
			...(dropdownOnly
				? {
						'& .MuiAutocomplete-input': {
							cursor: disabled ? 'default' : 'pointer',
						},
					}
				: {}),
			...sx,
		},
	};

	return <Autocomplete {...autocompleteProps} />;
}

export { StandardAutocomplete };
