import { supabase } from '../supabase/supabase-utils';

const CLIPBOARD_IMAGES_BUCKET = 'clipboard-images';

/** A previewed image that can originate from an upload, data URL, or Supabase storage. */
export interface ClipboardImageSource {
	src: string;
	storageFilename?: string;
	pendingFile?: File;
}

function dataUrlToBlob(dataUrl: string): Blob {
	const [header, encoded] = dataUrl.split(',');
	if (!encoded) {
		throw new Error('Invalid data URL');
	}

	const mime = header.match(/:(.*?);/)?.[1] ?? 'image/png';
	const binary = atob(encoded);
	const bytes = new Uint8Array(binary.length);
	for (let i = 0; i < binary.length; i += 1) {
		bytes[i] = binary.charCodeAt(i);
	}
	return new Blob([bytes], { type: mime });
}

function canvasToPngBlob(canvas: HTMLCanvasElement): Promise<Blob> {
	return new Promise((resolve, reject) => {
		canvas.toBlob(
			(blob) => (blob ? resolve(blob) : reject(new Error('PNG export failed'))),
			'image/png',
		);
	});
}

function loadImage(src: string, crossOrigin?: string): Promise<HTMLImageElement> {
	return new Promise((resolve, reject) => {
		const img = new Image();
		if (crossOrigin) {
			img.crossOrigin = crossOrigin;
		}
		img.onload = () => resolve(img);
		img.onerror = () => reject(new Error('Image load failed'));
		img.src = src;
	});
}

async function drawImageToPng(src: string): Promise<Blob> {
	const img = await loadImage(src, 'anonymous');
	const canvas = document.createElement('canvas');
	canvas.width = img.naturalWidth;
	canvas.height = img.naturalHeight;
	const ctx = canvas.getContext('2d');
	if (!ctx) {
		throw new Error('Canvas 2D context unavailable');
	}
	ctx.drawImage(img, 0, 0);
	return canvasToPngBlob(canvas);
}

/** Normalises any image blob to PNG, which is the only format browsers reliably accept. */
async function blobToPngBlob(blob: Blob): Promise<Blob> {
	if (blob.type === 'image/png') {
		return blob;
	}

	const url = URL.createObjectURL(blob);
	try {
		return await drawImageToPng(url);
	} finally {
		URL.revokeObjectURL(url);
	}
}

/**
 * Resolves a preview item to a PNG blob, preferring the most direct source to
 * avoid CORS issues: the pending upload, then a data URL, then a Supabase
 * download, then a network fetch, and finally a canvas re-render as a last resort.
 */
export async function imageSourceToPngBlob(
	source: ClipboardImageSource,
): Promise<Blob> {
	if (source.pendingFile) {
		return blobToPngBlob(source.pendingFile);
	}

	if (source.src.startsWith('data:')) {
		return blobToPngBlob(dataUrlToBlob(source.src));
	}

	if (source.storageFilename) {
		const { data, error } = await supabase.storage
			.from(CLIPBOARD_IMAGES_BUCKET)
			.download(source.storageFilename);
		if (!error && data) {
			return blobToPngBlob(data);
		}
	}

	try {
		const response = await fetch(source.src, { mode: 'cors' });
		if (response.ok) {
			return blobToPngBlob(await response.blob());
		}
	} catch {
		// Fall through to the canvas re-render below.
	}

	return drawImageToPng(source.src);
}

function extensionForImageType(type: string): string {
	return type.split('/')[1]?.split('+')[0] ?? 'png';
}

function isImageMimeType(type: string): boolean {
	return type.startsWith('image/');
}

/** Reads image files currently on the system clipboard via the Async Clipboard API. */
export async function readImagesFromClipboard(): Promise<File[]> {
	const files: File[] = [];
	const clipboardItems = await navigator.clipboard.read();

	for (const item of clipboardItems) {
		const imageTypes = item.types.filter(isImageMimeType);
		if (imageTypes.length === 0) {
			continue;
		}

		const type = imageTypes.includes('image/png') ? 'image/png' : imageTypes[0];
		const blob = await item.getType(type);
		const mimeType = blob.type.startsWith('image/') ? blob.type : type;
		files.push(
			new File(
				[blob],
				`pasted-image-${files.length + 1}.${extensionForImageType(mimeType)}`,
				{ type: mimeType },
			),
		);
	}

	return files;
}

/** Extracts image files from a drag, drop, or keyboard-paste DataTransfer. */
export function getImageFilesFromDataTransfer(
	data: DataTransfer | null,
): File[] {
	if (!data) {
		return [];
	}

	const fromFiles = Array.from(data.files).filter((file) =>
		isImageMimeType(file.type),
	);
	if (fromFiles.length > 0) {
		return fromFiles;
	}

	return Array.from(data.items)
		.filter((item) => item.kind === 'file' && isImageMimeType(item.type))
		.map((item) => item.getAsFile())
		.filter((file): file is File => file !== null);
}

/** Writes a single PNG blob to the system clipboard. */
export async function writePngToClipboard(pngBlob: Blob): Promise<void> {
	await navigator.clipboard.write([
		new ClipboardItem({
			'image/png': Promise.resolve(pngBlob),
		}),
	]);
}
