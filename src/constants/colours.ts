/**
 * Shared colour palette for inline JS/TSX styles.
 * Solid equivalents are available as CSS custom properties in src/styles/variables.css.
 */
export const colours = {
	primary: '#282c34',
	secondary: '#ffa865',
	text: '#ecf0f1',
	textSecondary: 'rgba(255, 255, 255, 0.87)',
	background: '#242424',
	disabledBg: '#424242',
	disabledColor: '#9e9e9e', // ~4.5:1 on panel, ~3.1:1 on disabledBg — passes WCAG AA for UI
	link: '#ffa865',
	underline: '#646cff',
	rust: 'rgba(130, 60, 55, 0.95)',
	teal: 'rgba(62, 171, 164, 0.95)',
	success: '#4caf50',
	warning: '#ffc107',
	danger: '#ff5252',
} as const;
