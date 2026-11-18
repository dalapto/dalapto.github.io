/// <reference types="vite/client" />

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey, {
	auth: {
		persistSession: true,
		autoRefreshToken: true,
		detectSessionInUrl: true,
	},
});

async function requireAuthSession() {
	const {
		data: { session },
		error,
	} = await supabase.auth.getSession();

	if (error) throw error;
	if (!session) {
		throw new Error('Not signed in — sign in before uploading files.');
	}

	return session;
}

function throwIfSupabaseError(
	error: { message: string; statusCode?: string | number } | null,
	context: string,
) {
	if (error) {
		const status =
			error.statusCode !== undefined ? ` (HTTP ${error.statusCode})` : '';
		throw Object.assign(new Error(`${context}: ${error.message}${status}`), {
			cause: error,
		});
	}
}

async function uploadToBucket(bucket: string, filename: string, file: File) {
	await requireAuthSession();

	const { data, error } = await supabase.storage.from(bucket).upload(filename, file, {
		upsert: true,
		contentType: file.type || 'application/octet-stream',
	});

	throwIfSupabaseError(error, `Upload to "${bucket}" failed`);
	if (!data?.path) {
		throw new Error(`Upload to "${bucket}" returned no file path.`);
	}

	return data;
}

async function removeFromBucket(bucket: string, filename: string) {
	await requireAuthSession();

	const { data, error } = await supabase.storage.from(bucket).remove([filename]);

	throwIfSupabaseError(error, `Remove from "${bucket}" failed`);

	return data;
}

function getStoragePublicUrl(bucket: string, filename: string) {
	return supabase.storage.from(bucket).getPublicUrl(filename).data.publicUrl;
}

const STORAGE_FILENAME_SEPARATOR = ',';

function splitStorageFilenames(value: string | null | undefined): string[] {
	if (!value?.trim()) return [];
	return value
		.split(STORAGE_FILENAME_SEPARATOR)
		.map((part) => part.trim())
		.filter(Boolean);
}

function joinStorageFilenames(filenames: string[]): string | null {
	if (filenames.length === 0) return null;
	return filenames.join(STORAGE_FILENAME_SEPARATOR);
}

type StorageSaveItem = {
	storageFilename?: string;
	pendingFile?: File;
};

/**
 * Uploads every pending file in `items` (in parallel) and returns the full
 * ordered filename list to store, plus which files were newly uploaded (so a
 * caller can roll them back if the row save fails). Deletes nothing.
 */
async function uploadStorageItems(
	bucket: string,
	items: StorageSaveItem[],
): Promise<{ filenamesCsv: string | null; uploaded: string[] }> {
	let uploadIndex = 0;
	const planned = items.map((item) => {
		if (item.pendingFile) {
			return {
				filename: clipboardFilename(item.pendingFile, uploadIndex++),
				file: item.pendingFile,
			};
		}
		return { filename: item.storageFilename, file: undefined };
	});

	const uploads = planned.filter(
		(p): p is { filename: string; file: File } => !!p.file && !!p.filename,
	);
	const results = await Promise.allSettled(
		uploads.map((p) => uploadToBucket(bucket, p.filename, p.file)),
	);
	const uploaded = uploads
		.filter((_, i) => results[i].status === 'fulfilled')
		.map((p) => p.filename);

	const failed = results.find(
		(r): r is PromiseRejectedResult => r.status === 'rejected',
	);
	if (failed) {
		// Don't leave half an upload batch behind.
		await removeFromBucketBestEffort(bucket, uploaded);
		throw failed.reason;
	}

	const filenames = planned
		.map((p) => p.filename)
		.filter((name): name is string => !!name);
	return { filenamesCsv: joinStorageFilenames(filenames), uploaded };
}

/** Deletes files, logging (not throwing) on failure — for cleanup after a successful save. */
async function removeFromBucketBestEffort(bucket: string, filenames: string[]) {
	const results = await Promise.allSettled(
		filenames.map((filename) => removeFromBucket(bucket, filename)),
	);
	results.forEach((result, i) => {
		if (result.status === 'rejected') {
			console.warn(
				`Cleanup: couldn't remove "${filenames[i]}" from "${bucket}"`,
				result.reason,
			);
		}
	});
}

function clipboardFilename(file: File, index = 0) {
	const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
	return `clipboard-${Date.now()}-${index}-${safeName}`;
}

function displayNameFromStorageFilename(filename: string) {
	return filename.replace(/^clipboard-\d+-\d+-/, '').replace(/^clipboard-\d+-/, '');
}

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

export {
	displayNameFromStorageFilename,
	formatSupabaseError,
	getStoragePublicUrl,
	isSupabaseLikeError,
	joinStorageFilenames,
	removeFromBucket,
	removeFromBucketBestEffort,
	splitStorageFilenames,
	throwIfSupabaseError,
	uploadStorageItems,
	uploadToBucket,
};
export type { StorageSaveItem, SupabaseLikeError };
