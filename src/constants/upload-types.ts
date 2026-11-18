import type { StorageSaveItem } from '../types/upload.types';

/**
 * What each upload control accepts, plus the hint shown to the user. Kept
 * together so the hint can't drift from the `accept` attribute.
 */
interface UploadTypeConfig {
	accept: string;
	hint: string;
}

const IMAGE_UPLOAD: UploadTypeConfig = {
	accept: 'image/*',
	hint: 'PNG, JPG, GIF, WebP, SVG',
};

const MEDIA_UPLOAD: UploadTypeConfig = {
	accept: 'image/*,audio/*,video/*',
	hint: 'Images (PNG, JPG, GIF, WebP), audio (MP3, WAV, OGG, M4A), video (MP4, WebM, MOV)',
};

const FILE_UPLOAD: UploadTypeConfig = {
	accept:
		'.pdf,.doc,.docx,.txt,.json,application/pdf,text/plain,application/json',
	hint: 'PDF, DOC, DOCX, TXT, JSON',
};

/** Most that a single save may upload (sum of the new files), checked before any request. */
const MAX_UPLOAD_TOTAL_BYTES = 50 * 1024 * 1024;

/** Total size of the files a save would upload (already-stored items cost nothing). */
function getPendingUploadBytes(items: StorageSaveItem[]): number {
	return items.reduce((total, item) => total + (item.pendingFile?.size ?? 0), 0);
}

function formatMegabytes(bytes: number): string {
	return `${(bytes / (1024 * 1024)).toFixed(1).replace(/\.0$/, '')} MB`;
}

type MediaKind = 'image' | 'audio' | 'video';

const AUDIO_EXTENSIONS = ['mp3', 'wav', 'ogg', 'oga', 'm4a', 'aac', 'flac', 'opus'];
const VIDEO_EXTENSIONS = ['mp4', 'webm', 'mov', 'm4v', 'ogv'];

function getExtension(name: string): string {
	const dot = name.lastIndexOf('.');
	return dot === -1 ? '' : name.slice(dot + 1).toLowerCase();
}

/**
 * Kind of a stored media file, from its name. Anything that isn't a known
 * audio or video extension is treated as an image, so images saved before
 * audio/video support still load.
 */
function getMediaKindFromName(name: string): MediaKind {
	const ext = getExtension(name);
	if (AUDIO_EXTENSIONS.includes(ext)) return 'audio';
	if (VIDEO_EXTENSIONS.includes(ext)) return 'video';
	return 'image';
}

/** Kind of a picked file, or null if it isn't image, audio or video. */
function getMediaKindFromFile(file: File): MediaKind | null {
	if (file.type.startsWith('image/')) return 'image';
	if (file.type.startsWith('audio/')) return 'audio';
	if (file.type.startsWith('video/')) return 'video';
	if (file.type) return null;

	// No MIME type reported (some OSes/browsers): fall back to the extension.
	const ext = getExtension(file.name);
	if (AUDIO_EXTENSIONS.includes(ext)) return 'audio';
	if (VIDEO_EXTENSIONS.includes(ext)) return 'video';
	return null;
}

export {
	FILE_UPLOAD,
	formatMegabytes,
	getMediaKindFromFile,
	getPendingUploadBytes,
	MAX_UPLOAD_TOTAL_BYTES,
	getMediaKindFromName,
	IMAGE_UPLOAD,
	MEDIA_UPLOAD,
};
export type { MediaKind, UploadTypeConfig };
