import { tokens } from './tokens';

const camelToKebab = (value: string) =>
	value.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);

/**
 * Pushes the design tokens onto :root as CSS custom properties so plain .css
 * files can reference the same values the MUI theme uses (var(--color-*),
 * var(--space-*), etc.). The app is a client-rendered SPA, so running this
 * before React mounts means no element paints before the variables exist.
 */
export function applyTokens(target: HTMLElement = document.documentElement) {
	const root = target.style;

	for (const [key, value] of Object.entries(tokens.colours)) {
		root.setProperty(`--color-${camelToKebab(key)}`, value);
	}

	for (let step = 0; step <= 8; step++) {
		root.setProperty(`--space-${step}`, `${step * tokens.spacingUnit}px`);
	}

	root.setProperty('--navbar-height', `${tokens.layout.navbarHeight}px`);
	root.setProperty('--transition-standard', tokens.transitions.standard);
	root.setProperty('--transition-fast', tokens.transitions.fast);
}
