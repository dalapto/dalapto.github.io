import { tokens } from '../styles/tokens';

const c = tokens.colours;

/**
 * Colour palette for inline JS/TSX styles — an alias of `tokens.colours`
 * (src/styles/tokens.ts), which is the single source of truth. Add or change
 * colours there, not here. New code can use `tokens.colours` / `theme.colours`
 * directly; this file keeps the older names working.
 */
export const colours = {
	primary: c.primary,
	secondary: c.secondary,
	text: c.text,
	textSecondary: c.textSecondary,
	background: c.background,
	disabledBg: c.disabledBg,
	disabledColor: c.disabledColor,
	link: c.link,
	underline: c.underline,
	rust: c.panelRust,
	teal: c.panelTeal,
	success: c.success,
	warning: c.warning,
	info: c.info,
	error: c.error,
	danger: c.error,
} as const;
