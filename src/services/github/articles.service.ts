import {
	ARTICLE_PAGE_IMAGE_FILENAME,
	articlePageImageRecordToObjectUrl,
	binaryToImageObjectUrl,
	encodeArticlePageImageFile,
	filterArticleTextFilenames,
	isArticlePageImageFilename,
	parseArticlePageImageRecord,
	validateArticlePageImageFile,
} from '../../utils/article-page-image';
import {
	deleteOrphanImagesFromGist,
	findGistFileByFilename,
	getGist,
	updateGist,
} from './github-api';
import { GIST_RAW_BASE, POINTER_GIST_OWNER } from './config';
import {
	type PointerGistEntry,
	fetchPointerGistEntriesAuth,
	findPointerKeyByGistId,
	mutatePointerGist,
	normalizePointerEntryFromGist,
} from './pointer-gist.service';

// Public article content (text + page images) and page-image upload.

function gistRawFileUrl(
	gistId: string,
	filename: string,
	cacheBust?: string | number,
): string {
	const base = `${GIST_RAW_BASE}/${POINTER_GIST_OWNER}/${gistId}/raw/${encodeURIComponent(
		filename.trim(),
	)}`;
	if (cacheBust === undefined) return base;
	return `${base}?v=${encodeURIComponent(String(cacheBust))}`;
}

export async function createArticlePageImageObjectUrl(
	entry: PointerGistEntry | undefined,
	token?: string,
): Promise<string | undefined> {
	const filename = entry?.image?.trim();
	if (!filename || !entry?.id) return undefined;

	try {
		if (token) {
			const gist = await getGist(token, entry.id);
			const file = findGistFileByFilename(gist.files, filename);
			if (!file) return undefined;

			if (file.content && !file.truncated) {
				return objectUrlFromGistFileContent(file.content);
			}

			if (file.raw_url) {
				return objectUrlFromRawResponse(
					await fetch(file.raw_url, { cache: 'no-store' }),
				);
			}
		}

		return objectUrlFromRawResponse(
			await fetch(
				gistRawFileUrl(
					entry.id,
					filename,
					entry.imageUpdatedAt ?? Date.now(),
				),
				{ cache: 'no-store' },
			),
		);
	} catch {
		return undefined;
	}
}

function objectUrlFromGistFileContent(content: string): string | undefined {
	const record = parseArticlePageImageRecord(content);
	if (!record) return undefined;
	return articlePageImageRecordToObjectUrl(record);
}

async function objectUrlFromRawResponse(
	res: Response,
): Promise<string | undefined> {
	if (!res.ok) return undefined;
	const contentType = res.headers.get('content-type') ?? '';
	if (contentType.startsWith('image/')) {
		return binaryToImageObjectUrl(await res.arrayBuffer(), contentType);
	}
	const record = parseArticlePageImageRecord(await res.text());
	if (!record) return undefined;
	return articlePageImageRecordToObjectUrl(record);
}

export async function fetchPublicGistFiles(
	gistId: string,
	filenames: string[],
): Promise<Array<{ filename: string; content: string }>> {
	const order = new Map(
		filenames.map((filename, index) => [
			filename.trim().toLowerCase(),
			index,
		]),
	);
	const results = await Promise.all(
		filenames.map(async (filename) => {
			const url = `${GIST_RAW_BASE}/${POINTER_GIST_OWNER}/${gistId}/raw/${encodeURIComponent(
				filename,
			)}`;
			const res = await fetch(url);
			if (!res.ok)
				throw new Error(`Failed to fetch ${filename}: ${res.status}`);
			return { filename, content: await res.text() };
		}),
	);
	return results.sort(
		(a, b) =>
			(order.get(a.filename.trim().toLowerCase()) ?? 0) -
			(order.get(b.filename.trim().toLowerCase()) ?? 0),
	);
}

interface ArticlePageImageInput {
	/** New image file to upload. */
	file?: File;
	/** When true, removes the current page image from the gist and pointer entry. */
	remove?: boolean;
}

/**
 * Uploads, replaces, or removes the page image for a tracked article gist.
 * Images are stored as `page-image.json` (base64 JSON text) because the gist
 * HTTP API cannot persist binary files.
 */
export async function syncArticlePageImage(
	token: string,
	gistId: string,
	input: ArticlePageImageInput,
): Promise<void> {
	if (!input.file && !input.remove) return;

	if (input.file) {
		const validationError = validateArticlePageImageFile(input.file);
		if (validationError) throw new Error(validationError);
	}

	const notRegisteredMessage =
		'Article is not registered in the pointer gist. Save a note first or register the article.';
	// Early check so nothing is uploaded for an unregistered article.
	const entriesBefore = await fetchPointerGistEntriesAuth(token);
	if (!findPointerKeyByGistId(entriesBefore, gistId)) {
		throw new Error(notRegisteredMessage);
	}

	const gistBefore = await getGist(token, gistId);
	const currentFilenames = Object.values(gistBefore.files).map(
		(file) => file.filename,
	);
	const textFilenames = filterArticleTextFilenames(currentFilenames);

	if (input.remove && textFilenames.length === 0) {
		throw new Error(
			'Cannot remove the page image because it is the only file in this article. Add a section first.',
		);
	}

	const filesPatch: Record<string, { content: string } | null> = {};
	let nextImage: string | undefined;

	if (input.remove) {
		for (const name of currentFilenames) {
			if (isArticlePageImageFilename(name)) {
				filesPatch[name] = null;
			}
		}
		nextImage = undefined;
	} else if (input.file) {
		const record = await encodeArticlePageImageFile(input.file);
		for (const name of currentFilenames) {
			if (
				isArticlePageImageFilename(name) &&
				name.trim().toLowerCase() !== ARTICLE_PAGE_IMAGE_FILENAME
			) {
				filesPatch[name] = null;
			}
		}
		filesPatch[ARTICLE_PAGE_IMAGE_FILENAME] = {
			content: JSON.stringify(record),
		};
		nextImage = ARTICLE_PAGE_IMAGE_FILENAME;
	}

	let gist = gistBefore;
	if (Object.keys(filesPatch).length > 0) {
		gist = await updateGist(token, gistId, { files: filesPatch });
	}

	const remainingFilenames = Object.values(gist.files)
		.filter(Boolean)
		.map((file) => file.filename);
	if (remainingFilenames.length === 0) {
		throw new Error('Cannot remove the last file from an article gist.');
	}

	if (nextImage && !findGistFileByFilename(gist.files, nextImage)) {
		throw new Error('Uploaded image file missing from gist.');
	}

	// The image upload is done; now apply it to the *latest* pointer entry.
	let orphanImages: string[] = [];
	const written = await mutatePointerGist(token, (entries) => {
		orphanImages = [];
		const key = findPointerKeyByGistId(entries, gistId);
		if (!key) throw new Error(notRegisteredMessage);

		const entryForNormalize: PointerGistEntry = { ...entries[key] };
		if (nextImage) {
			entryForNormalize.image = nextImage;
			entryForNormalize.imageUpdatedAt = gist.updated_at;
		} else {
			delete entryForNormalize.image;
			delete entryForNormalize.imageUpdatedAt;
		}

		const result = normalizePointerEntryFromGist(
			entryForNormalize,
			remainingFilenames,
		);
		orphanImages = result.orphanImages;
		return { ...entries, [key]: result.entry };
	});

	if (written) await deleteOrphanImagesFromGist(token, gistId, orphanImages);
}
