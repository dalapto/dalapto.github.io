const IMAGE_FILE_PATTERN = /\.(jpe?g|png|gif|webp|svg|bmp|ico)$/i;

/** Text sidecar stored in the article gist. GitHub's gist API cannot persist binary files. */
export const ARTICLE_PAGE_IMAGE_FILENAME = 'page-image.json';

export const MAX_ARTICLE_IMAGE_BYTES = 1024 * 1024 * 5;

export interface ArticlePageImageRecord {
	filename: string;
	type: string;
	data: string;
}

export function isArticleImageFilename(filename: string): boolean {
	return IMAGE_FILE_PATTERN.test(filename.trim());
}

export function isArticlePageImageFilename(filename: string): boolean {
	const name = filename.trim().toLowerCase();
	return name === ARTICLE_PAGE_IMAGE_FILENAME || isArticleImageFilename(name);
}

/** Text chapter filenames only — excludes page image sidecar and image extensions. */
export function filterArticleTextFilenames(
	filenames: string[],
	imageFilename?: string | null,
): string[] {
	const imageKey = imageFilename?.trim().toLowerCase();
	return filenames
		.filter((name) => {
			const trimmed = name.trim();
			if (imageKey && trimmed.toLowerCase() === imageKey) return false;
			if (isArticlePageImageFilename(trimmed)) return false;
			return true;
		})
		.sort((a, b) => a.localeCompare(b));
}

export function validateArticlePageImageFile(file: File): string | null {
	if (!file.type.startsWith('image/')) {
		return 'File must be an image (JPEG, PNG, GIF, or WebP).';
	}
	if (file.size > MAX_ARTICLE_IMAGE_BYTES) {
		return (
			'Image must be 5 MB or smaller. Image size: ' +
			(file.size / 1024 / 1024).toFixed(2) +
			' MB.'
		);
	}
	return null;
}

/** Image files in the gist that are not the designated page image. */
export function findOrphanImageFilenames(
	gistFilenames: string[],
	imageFilename?: string | null,
): string[] {
	const imageKey = imageFilename?.trim().toLowerCase();
	return gistFilenames.filter((name) => {
		const trimmed = name.trim();
		if (imageKey && trimmed.toLowerCase() === imageKey) return false;
		return isArticlePageImageFilename(trimmed);
	});
}

export function findPageImageFilename(
	gistFilenames: string[],
): string | undefined {
	return gistFilenames.find(
		(name) => name.trim().toLowerCase() === ARTICLE_PAGE_IMAGE_FILENAME,
	);
}

function isLikelyImageBytes(bytes: Uint8Array): boolean {
	if (bytes.length < 4) return false;
	// JPEG
	if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return true;
	// PNG
	if (
		bytes[0] === 0x89 &&
		bytes[1] === 0x50 &&
		bytes[2] === 0x4e &&
		bytes[3] === 0x47
	) {
		return true;
	}
	// GIF
	if (bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46) return true;
	// WebP (RIFF....WEBP)
	if (
		bytes.length >= 12 &&
		bytes[0] === 0x52 &&
		bytes[1] === 0x49 &&
		bytes[2] === 0x46 &&
		bytes[3] === 0x46 &&
		bytes[8] === 0x57 &&
		bytes[9] === 0x45 &&
		bytes[10] === 0x42 &&
		bytes[11] === 0x50
	) {
		return true;
	}
	return false;
}

function sniffImageMime(bytes: Uint8Array): string {
	if (bytes[0] === 0xff && bytes[1] === 0xd8) return 'image/jpeg';
	if (bytes[0] === 0x89 && bytes[1] === 0x50) return 'image/png';
	if (bytes[0] === 0x47 && bytes[1] === 0x49) return 'image/gif';
	if (bytes[0] === 0x52 && bytes[1] === 0x49) return 'image/webp';
	return 'application/octet-stream';
}

export function bytesToBase64(bytes: Uint8Array): string {
	let binary = '';
	for (let i = 0; i < bytes.length; i++) {
		binary += String.fromCharCode(bytes[i]);
	}
	return btoa(binary);
}

export function base64ToBytes(base64: string): Uint8Array {
	const cleaned = base64.replace(/\s/g, '');
	const binary = atob(cleaned);
	const bytes = new Uint8Array(binary.length);
	for (let i = 0; i < binary.length; i++) {
		bytes[i] = binary.charCodeAt(i);
	}
	return bytes;
}

export async function encodeArticlePageImageFile(
	file: File,
): Promise<ArticlePageImageRecord> {
	const bytes = new Uint8Array(await file.arrayBuffer());
	if (!isLikelyImageBytes(bytes)) {
		throw new Error(
			'Uploaded file did not resolve as an image. Try JPEG, PNG, GIF, or WebP.',
		);
	}
	return {
		filename: file.name,
		type: file.type || sniffImageMime(bytes),
		data: bytesToBase64(bytes),
	};
}

export function parseArticlePageImageRecord(
	content: string,
): ArticlePageImageRecord | null {
	const trimmed = content.trim();
	if (!trimmed) return null;

	if (trimmed.startsWith('data:image/')) {
		const match = /^data:([^;]+);base64,([\s\S]+)$/.exec(trimmed);
		if (!match) return null;
		return { filename: 'image', type: match[1], data: match[2].replace(/\s/g, '') };
	}

	try {
		const parsed = JSON.parse(trimmed) as Partial<ArticlePageImageRecord>;
		if (parsed && typeof parsed.data === 'string' && parsed.data.length > 0) {
			return {
				filename:
					typeof parsed.filename === 'string' && parsed.filename.trim()
						? parsed.filename
						: 'image',
				type:
					typeof parsed.type === 'string' && parsed.type.trim()
						? parsed.type
						: 'application/octet-stream',
				data: parsed.data.replace(/\s/g, ''),
			};
		}
	} catch {
		// Fall through to raw base64.
	}

	try {
		const decoded = base64ToBytes(trimmed);
		if (isLikelyImageBytes(decoded)) {
			return {
				filename: 'image',
				type: sniffImageMime(decoded),
				data: trimmed.replace(/\s/g, ''),
			};
		}
	} catch {
		return null;
	}

	return null;
}

export function articlePageImageRecordToObjectUrl(
	record: ArticlePageImageRecord,
): string {
	const bytes = base64ToBytes(record.data);
	if (!isLikelyImageBytes(bytes)) {
		throw new Error('Stored page image is not a valid JPEG, PNG, GIF, or WebP.');
	}
	const copy = new Uint8Array(bytes);
	return URL.createObjectURL(
		new Blob([copy], { type: record.type || sniffImageMime(bytes) }),
	);
}

export function binaryToImageObjectUrl(
	buffer: ArrayBuffer,
	mimeType?: string,
): string | undefined {
	const bytes = new Uint8Array(buffer);
	if (!isLikelyImageBytes(bytes)) return undefined;
	const copy = new Uint8Array(bytes);
	return URL.createObjectURL(
		new Blob([copy], { type: mimeType || sniffImageMime(bytes) }),
	);
}
