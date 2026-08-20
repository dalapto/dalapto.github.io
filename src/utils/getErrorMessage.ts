import { formatSupabaseError, isSupabaseLikeError } from '../supabase/supabase-utils';

function logErrorDetails(error: unknown, context?: string) {
	const label = context ? `[${context}]` : '[Error]';
	console.error(label, error);

	if (error instanceof Error && error.cause) {
		console.error(`${label} cause:`, error.cause);
	}

	if (error && typeof error === 'object') {
		try {
			console.error(`${label} serialized:`, JSON.stringify(error, null, 2));
		} catch {
			console.error(`${label} could not serialize error object`);
		}
	}
}

function reportError(
	error: unknown,
	context?: string,
	fallback = 'Something went wrong. Please try again.',
) {
	logErrorDetails(error, context);
	return getErrorMessage(error, fallback);
}

function getErrorMessage(
	error: unknown,
	fallback = 'Something went wrong. Please try again.',
) {
	if (!error) return fallback;

	if (typeof error === 'string' && error.trim()) return error.trim();

	if (isSupabaseLikeError(error)) {
		return formatSupabaseError(error) ?? fallback;
	}

	if (error instanceof Error && error.message.trim()) {
		if (error.cause) {
			const fromCause = getErrorMessage(error.cause, '');
			if (fromCause && !error.message.includes(fromCause)) {
				return `${error.message.trim()} — ${fromCause}`;
			}
		}
		return error.message.trim();
	}

	return fallback;
}

export { getErrorMessage, logErrorDetails, reportError };
