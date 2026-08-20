import type { StoredFile } from '../components/controls/FileUpload/FileUpload';
import type { StoredImage } from '../components/controls/ImageUpload/ImageUpload';
import {
	displayNameFromStorageFilename,
	formatSupabaseError,
	getStoragePublicUrl,
	isSupabaseLikeError,
	splitStorageFilenames,
} from '../supabase/supabase-utils';

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

export function toStoredImages(filenamesCsv: string | null): StoredImage[] {
	return splitStorageFilenames(filenamesCsv).map((storageFilename) => ({
		storageFilename,
		url: getStoragePublicUrl('clipboard-images', storageFilename),
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

export function getClipboardErrorMessage(
	error: unknown,
	fallback = 'Something went wrong. Please try again.',
): string {
	if (!error) return fallback;

	if (typeof error === 'string' && error.trim()) return error.trim();

	if (isSupabaseLikeError(error)) {
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
