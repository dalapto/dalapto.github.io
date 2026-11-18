export const GITHUB_API_BASE = 'https://api.github.com';
export const GIST_RAW_BASE = 'https://gist.githubusercontent.com';

function requireEnv(name: string, value: string | undefined): string {
	if (!value?.trim()) {
		throw new Error(`Missing ${name} — add it to .env (see .env for the other VITE_ settings).`);
	}
	return value.trim();
}

/** Gist holding PointerGistIDs.json — the Writing index. */
export const POINTER_GIST_ID = requireEnv(
	'VITE_POINTER_GIST_ID',
	import.meta.env.VITE_POINTER_GIST_ID,
);
/** GitHub user that owns the pointer gist and all article gists (used for public raw URLs). */
export const POINTER_GIST_OWNER = requireEnv(
	'VITE_POINTER_GIST_OWNER',
	import.meta.env.VITE_POINTER_GIST_OWNER,
);
export const POINTER_GIST_FILENAME = 'PointerGistIDs.json';
