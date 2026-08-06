/**
 * Single source of truth for design tokens.
 *
 * These values feed BOTH:
 *  - the MUI theme (src/styles/theme.ts) -> consumed in TSX via `theme.spacing()` / `theme.colours`
 *  - the CSS custom properties (src/styles/applyTokens.ts) -> consumed in .css files via `var(--...)`
 *
 * Never hardcode a spacing/colour value elsewhere — add it here and reference it.
 */
export const tokens = {
	/** Base unit for the spacing scale. `spacing(2)` => 16px. */
	spacingUnit: 8,

	colours: {
		primary: '#282c34',
		secondary: '#ffa865',
		text: '#ecf0f1',
		textSecondary: 'rgba(255, 255, 255, 0.87)',
		background: '#242424',
		link: '#ffa865',
		linkHover: '#ffa865',
		underline: '#646cff',
		panelRust: 'rgba(130, 60, 55, 0.95)',
		panelTeal: 'rgba(62, 171, 164, 0.95)',
		error: '#ff6b6b',
	},

	layout: {
		navbarHeight: 64,
	},

	transitions: {
		standard: '0.5s',
		fast: '0.2s',
	},
} as const;

export type Tokens = typeof tokens;
export type Colours = Tokens['colours'];
