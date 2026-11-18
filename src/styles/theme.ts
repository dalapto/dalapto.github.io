import { createTheme } from '@mui/material/styles';
import { tokens, type Colours } from './tokens';

declare module '@mui/material/styles' {
	interface Theme {
		colours: Colours;
	}
	interface ThemeOptions {
		colours?: Colours;
	}
}

export const theme = createTheme({
	spacing: tokens.spacingUnit,
	colours: tokens.colours,
	palette: {
		primary: { main: tokens.colours.primary },
		secondary: { main: tokens.colours.secondary },
		error: { main: tokens.colours.error },
		background: { default: tokens.colours.background },
		text: {
			primary: tokens.colours.text,
			secondary: tokens.colours.textSecondary,
		},
	},
	components: {
		MuiFormHelperText: {
			styleOverrides: {
				root: {
					'&.Mui-error': {
						color: tokens.colours.error,
					},
				},
			},
		},
		MuiInputLabel: {
			styleOverrides: {
				root: {
					'&.Mui-error': {
						color: tokens.colours.error,
					},
				},
			},
		},
		MuiOutlinedInput: {
			styleOverrides: {
				root: {
					'&.Mui-error .MuiOutlinedInput-notchedOutline': {
						borderColor: tokens.colours.error,
					},
					'&.Mui-error:hover .MuiOutlinedInput-notchedOutline': {
						borderColor: tokens.colours.error,
					},
					'&.Mui-focused.Mui-error .MuiOutlinedInput-notchedOutline': {
						borderColor: tokens.colours.error,
					},
				},
			},
		},
	},
});
