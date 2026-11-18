import {
	formatSupabaseError,
	isSupabaseLikeError,
} from '../supabase/supabase-errors';
import {
	displayNameFromStorageFilename,
	getStoragePublicUrl,
	splitStorageFilenames,
} from '../supabase/supabase-utils';
import type { StoredFile, StoredMedia } from '../types/upload.types';

export type TabId = 'text' | 'image' | 'file';

export type ClipboardRow = {
	id: number;
	last_tab: TabId | null;
	text_content: string | null;
	text_last_updated: string | null;
	image_filename: string | null;
	image_last_updated: string | null;
	file_filename: string | null;
	file_last_updated: string | null;
};

export const CLIPBOARD_ROW_ID = 1;

export function parseTimestamp(value: string | null | undefined): Date {
	return value ? new Date(value) : new Date(0);
}

/** Media tab items (images, audio, video), stored in the `clipboard-images` bucket. */
export function toStoredMedia(filenamesCsv: string | null): StoredMedia[] {
	return splitStorageFilenames(filenamesCsv).map((storageFilename) => ({
		storageFilename,
		url: getStoragePublicUrl('clipboard-images', storageFilename),
		name: displayNameFromStorageFilename(storageFilename),
	}));
}

export function toStoredFiles(filenamesCsv: string | null): StoredFile[] {
	return splitStorageFilenames(filenamesCsv).map((storageFilename) => ({
		storageFilename,
		url: getStoragePublicUrl('clipboard-files', storageFilename),
		name: displayNameFromStorageFilename(storageFilename),
	}));
}

const CLIPBOARD_ERROR_MESSAGES: Record<string, string> = {
	PGRST116:
		'Clipboard row not found — add a single row to the clipboard table.',
	'403':
		'Storage permission denied. Run supabase/clipboard-policies.sql in the Supabase SQL editor (creates buckets + RLS policies).',
};

/** Storage refuses files over the bucket's size limit or outside its allowed MIME types. */
function getRejectedUploadMessage(error: {
	message?: string;
	statusCode?: string | number;
}): string | null {
	const status = String(error.statusCode ?? '');
	const message = error.message ?? '';
	if (status === '413' || /maximum allowed size|too large/i.test(message)) {
		return 'File is too large for the storage bucket. Raise the bucket size limit in Supabase or upload a smaller file.';
	}
	if (status === '415' || /mime type .* not supported/i.test(message)) {
		return "This file type isn't allowed by the storage bucket. Add it to the bucket's allowed MIME types in Supabase.";
	}
	return null;
}

export function getClipboardErrorMessage(
	error: unknown,
	fallback = 'Something went wrong. Please try again.',
): string {
	if (!error) return fallback;

	if (typeof error === 'string' && error.trim()) return error.trim();

	if (isSupabaseLikeError(error)) {
		const rejected = getRejectedUploadMessage(error);
		if (rejected) return rejected;
		return formatSupabaseError(error, CLIPBOARD_ERROR_MESSAGES) ?? fallback;
	}

	if (error instanceof Error && error.message.trim()) {
		if (error.cause) {
			const fromCause = getClipboardErrorMessage(error.cause, '');
			if (fromCause && !error.message.includes(fromCause)) {
				return `${error.message.trim()} — ${fromCause}`;
			}
		}
		return error.message.trim();
	}

	return fallback;
}
