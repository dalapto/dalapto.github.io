// Supabase error helpers. Deliberately free of the Supabase client so that
// generic code (getErrorMessage, toasts, GitHub services) can use them without
// creating the client on import.

type SupabaseLikeError = {
	message?: string;
	details?: string;
	hint?: string;
	code?: string;
	statusCode?: string | number;
};

const GENERIC_CODE_MESSAGES: Record<string, string> = {
	PGRST301: 'Permission denied by row-level security.',
	'42501': 'Permission denied. Check your Supabase RLS policies.',
};

function isSupabaseLikeError(error: unknown): error is SupabaseLikeError {
	return typeof error === 'object' && error !== null && 'message' in error;
}

function formatSupabaseError(
	error: SupabaseLikeError,
	codeMessages: Record<string, string> = {},
): string | null {
	if (
		error.message?.includes('row-level security') ||
		error.statusCode === 403 ||
		error.statusCode === '403'
	) {
		return (
			codeMessages['403'] ??
			'Permission denied. Check your Supabase RLS and storage policies.'
		);
	}

	const merged = { ...GENERIC_CODE_MESSAGES, ...codeMessages };
	const friendly = error.code ? merged[error.code] : undefined;
	if (friendly) return friendly;

	const parts: string[] = [];

	if (error.message?.trim()) parts.push(error.message.trim());
	if (error.details?.trim()) parts.push(error.details.trim());
	if (error.hint?.trim()) parts.push(error.hint.trim());
	if (error.code && !parts.some((part) => part.includes(error.code!))) {
		parts.push(`(${error.code})`);
	}
	if (error.statusCode) parts.push(`HTTP ${error.statusCode}`);

	return parts.length > 0 ? parts.join(' — ') : null;
}

export { formatSupabaseError, isSupabaseLikeError };
export type { SupabaseLikeError };
