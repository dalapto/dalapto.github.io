import type {
	Folder,
	FolderRevision,
	GitHubUser,
	ListFoldersOptions,
	Note,
	SaveNoteInput,
} from '../types/github.types';
import {
	ARTICLE_PAGE_IMAGE_FILENAME,
	articlePageImageRecordToObjectUrl,
	binaryToImageObjectUrl,
	encodeArticlePageImageFile,
	filterArticleTextFilenames,
	findOrphanImageFilenames,
	findPageImageFilename,
	isArticlePageImageFilename,
	parseArticlePageImageRecord,
	validateArticlePageImageFile,
} from '../utils/article-page-image';
import {
	type PointerGistArticle,
	mergeArticlesWithGistFilenames,
	migrateLegacyArticles,
	renameArticleInList,
} from '../utils/pointer-gist-articles';

const GITHUB_API_BASE = 'https://api.github.com';
const GIST_RAW_BASE = 'https://gist.githubusercontent.com';

const POINTER_GIST_ID = '7d48f1881df7e46bf6e0425b50666131';
const POINTER_GIST_OWNER = 'dalapto';
const POINTER_GIST_FILENAME = 'PointerGistIDs.json';

export type { PointerGistArticle } from '../utils/pointer-gist-articles';

/** Shape of each entry in the pointer gist file. */
export interface PointerGistEntry {
	id: string;
	hidden: boolean;
	articles: PointerGistArticle[];
	/** Filename of the page image stored in the article gist (not a text chapter). */
	image?: string;
	/** ISO timestamp — cache-bust token for public raw image URLs after upload/replace. */
	imageUpdatedAt?: string;
}

type RawPointerGistEntry = PointerGistEntry & { files?: string[] };

function normalizeStoredPointerGistEntry(
	raw: RawPointerGistEntry,
): PointerGistEntry {
	const { files: _legacyFiles, ...rest } = raw;
	return {
		...rest,
		articles: migrateLegacyArticles(raw),
	};
}

function normalizeStoredPointerGistEntries(
	entries: Record<string, RawPointerGistEntry>,
): Record<string, PointerGistEntry> {
	return Object.fromEntries(
		Object.entries(entries).map(([key, entry]) => [
			key,
			normalizeStoredPointerGistEntry(entry),
		]),
	);
}

export function gistRawFileUrl(
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

export function findPointerGistEntryByFolderName(
	entries: Record<string, PointerGistEntry>,
	folderName: string,
): { key: string; entry: PointerGistEntry } | undefined {
	const normalized = folderName.trim().toLowerCase();
	const key = Object.keys(entries).find(
		(k) => k.trim().toLowerCase() === normalized,
	);
	if (!key) return undefined;
	return { key, entry: entries[key] };
}

interface GistFile {
	filename: string;
	content?: string;
	encoding?: 'base64' | 'utf-8';
	truncated?: boolean;
	raw_url?: string;
	size?: number;
	type?: string;
}

interface Gist {
	id: string;
	html_url: string;
	description: string | null;
	updated_at: string;
	files: Record<string, GistFile>;
}

interface GistCommit {
	version: string;
	committed_at: string;
	change_status: {
		total: number;
		additions: number;
		deletions: number;
	};
}

async function githubFetch<T>(
	token: string,
	path: string,
	init?: RequestInit,
): Promise<T> {
	const res = await fetch(`${GITHUB_API_BASE}${path}`, {
		...init,
		headers: {
			Authorization: `Bearer ${token}`,
			Accept: 'application/vnd.github+json',
			...init?.headers,
		},
	});
	if (!res.ok) {
		const detail = (await res.text().catch(() => '')).slice(0, 300);
		throw new Error(
			`GitHub API error: ${res.status} ${path}${detail ? ` — ${detail}` : ''}`,
		);
	}
	if (res.status === 204) return undefined as T;
	return res.json() as Promise<T>;
}

function gistToFolder(gist: Gist): Folder {
	return {
		id: gist.id,
		name: gist.description ?? gist.id,
		updatedAt: gist.updated_at,
		htmlUrl: gist.html_url,
		noteFilenames: filterArticleTextFilenames(
			Object.values(gist.files).map((file) => file.filename),
		),
		isSecret: true,
	};
}

function gistToNotes(gist: Gist): Note[] {
	return Object.values(gist.files).map((file) => ({
		folderId: gist.id,
		filename: file.filename,
		content: file.content ?? '',
		updatedAt: gist.updated_at,
	}));
}

async function listGists(
	token: string,
	options: ListFoldersOptions = {},
): Promise<Gist[]> {
	const params = new URLSearchParams();
	if (options.since) params.set('since', options.since);
	if (options.perPage) params.set('per_page', String(options.perPage));
	if (options.page) params.set('page', String(options.page));
	const query = params.toString();
	return githubFetch<Gist[]>(token, `/gists${query ? `?${query}` : ''}`);
}

async function listAllGists(token: string): Promise<Gist[]> {
	const all: Gist[] = [];
	for (let page = 1; ; page += 1) {
		const batch = await listGists(token, { perPage: 100, page });
		all.push(...batch);
		if (batch.length < 100) return all;
	}
}

function normalizePointerEntryFromGist(
	entry: PointerGistEntry,
	gistFilenames: string[],
	orderUpdates: PointerGistArticle[] = [],
): { entry: PointerGistEntry; orphanImages: string[] } {
	const gistKeys = new Set(gistFilenames.map((f) => f.trim().toLowerCase()));
	let image = entry.image?.trim();
	if (image && !gistKeys.has(image.toLowerCase())) {
		image = undefined;
	}
	if (!image) {
		image = findPageImageFilename(gistFilenames);
	}

	const orphanImages = findOrphanImageFilenames(gistFilenames, image);
	const next: PointerGistEntry = {
		...entry,
		articles: mergeArticlesWithGistFilenames(
			entry.articles,
			gistFilenames,
			image,
			orderUpdates,
		),
	};

	if (image) {
		next.image = image;
	} else {
		delete next.image;
		delete next.imageUpdatedAt;
	}

	return { entry: next, orphanImages };
}

async function deleteOrphanImagesFromGist(
	token: string,
	gistId: string,
	filenames: string[],
): Promise<void> {
	if (filenames.length === 0) return;
	const filesPatch = Object.fromEntries(
		filenames.map((name) => [name, null]),
	) as Record<string, null>;
	await updateGist(token, gistId, { files: filesPatch });
}

async function getGist(token: string, gistId: string): Promise<Gist> {
	return githubFetch<Gist>(token, `/gists/${gistId}`);
}

async function createGist(
	token: string,
	input: {
		description: string;
		files: Record<string, { content: string }>;
		isSecret?: boolean;
	},
): Promise<Gist> {
	return githubFetch<Gist>(token, '/gists', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			description: input.description,
			files: input.files,
			public: false, // always create secret gists
		}),
	});
}

async function updateGist(
	token: string,
	gistId: string,
	input: {
		description?: string | null;
		files?: Record<string, { content: string } | null>;
	},
): Promise<Gist> {
	return githubFetch<Gist>(token, `/gists/${gistId}`, {
		method: 'PATCH',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(input),
	});
}

async function deleteGist(token: string, gistId: string): Promise<void> {
	await githubFetch<void>(token, `/gists/${gistId}`, { method: 'DELETE' });
}

export async function fetchPointerGistEntries(): Promise<
	Record<string, PointerGistEntry>
> {
	const url = `${GIST_RAW_BASE}/${POINTER_GIST_OWNER}/${POINTER_GIST_ID}/raw/${POINTER_GIST_FILENAME}?_=${Date.now()}`;
	const res = await fetch(url, { cache: 'no-store' });
	if (!res.ok) throw new Error(`Failed to fetch pointer gist: ${res.status}`);
	const parsed = (await res.json()) as Record<string, RawPointerGistEntry>;
	return normalizeStoredPointerGistEntries(parsed);
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

async function patchPointerGist(
	token: string,
	updated: Record<string, PointerGistEntry>,
): Promise<void> {
	await githubFetch<Gist>(token, `/gists/${POINTER_GIST_ID}`, {
		method: 'PATCH',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			files: {
				[POINTER_GIST_FILENAME]: {
					content: JSON.stringify(updated, null, 2),
				},
			},
		}),
	});
}

/**
 * Reads pointer gist entries via the authenticated GitHub API.
 * Used internally by write-path functions to avoid CDN staleness or auth issues
 * that can affect the public raw URL used by `fetchPointerGistEntries`.
 */
function dedupePointerGistEntries(
	entries: Record<string, PointerGistEntry>,
): Record<string, PointerGistEntry> {
	const byGistId = new Map<string, [string, PointerGistEntry]>();
	for (const [key, entry] of Object.entries(entries)) {
		const trimmedKey = key.trim();
		const existing = byGistId.get(entry.id);
		if (!existing) {
			byGistId.set(entry.id, [trimmedKey, entry]);
			continue;
		}
		if (trimmedKey.length < existing[0].length) {
			byGistId.set(entry.id, [trimmedKey, entry]);
		}
	}

	const byName = new Map<string, [string, PointerGistEntry]>();
	for (const [key, entry] of byGistId.values()) {
		const nameKey = key.trim().toLowerCase();
		const existing = byName.get(nameKey);
		if (!existing) {
			byName.set(nameKey, [key, entry]);
			continue;
		}
		const score = (item: PointerGistEntry) =>
			(item.image ? 10 : 0) + item.articles.length;
		if (score(entry) > score(existing[1])) {
			byName.set(nameKey, [key, entry]);
		}
	}

	return Object.fromEntries(
		[...byName.values()].map(([key, entry]) => [key, entry]),
	);
}

function findGistFileByFilename(
	files: Record<string, GistFile>,
	filename: string,
): GistFile | undefined {
	const normalized = filename.trim().toLowerCase();
	return Object.values(files).find(
		(file) => file.filename.trim().toLowerCase() === normalized,
	);
}

async function fetchPointerGistEntriesAuth(
	token: string,
): Promise<Record<string, PointerGistEntry>> {
	const gist = await getGist(token, POINTER_GIST_ID);
	const file = gist.files[POINTER_GIST_FILENAME];
	if (!file?.content) throw new Error('Pointer gist file not found or empty');
	const parsed = JSON.parse(file.content) as Record<string, RawPointerGistEntry>;
	return dedupePointerGistEntries(normalizeStoredPointerGistEntries(parsed));
}

/** Updates the article list for a tracked gist, preserving order where possible. No-ops silently if the gist isn't tracked. */
async function syncPointerGistArticles(
	token: string,
	gistId: string,
	filenames: string[],
	options: { renamedFrom?: string; renamedTo?: string } = {},
): Promise<void> {
	const entries = await fetchPointerGistEntriesAuth(token);
	const key = Object.keys(entries).find((k) => entries[k].id === gistId);
	if (!key) return;
	const entry = entries[key];
	let articles = entry.articles;
	if (options.renamedFrom && options.renamedTo) {
		articles = renameArticleInList(
			articles,
			options.renamedFrom,
			options.renamedTo,
		);
	}
	const { entry: normalized } = normalizePointerEntryFromGist(
		{ ...entry, articles },
		filenames,
	);
	await patchPointerGist(token, {
		...entries,
		[key]: {
			...normalized,
			id: gistId,
		},
	});
}

/** Updates the `hidden` flag for a tracked gist. No-ops silently if the gist isn't tracked. */
export async function updatePointerGistHidden(
	token: string,
	gistId: string,
	hidden: boolean,
): Promise<void> {
	const entries = await fetchPointerGistEntriesAuth(token);
	const key = Object.keys(entries).find((k) => entries[k].id === gistId);
	if (!key) return;
	await patchPointerGist(token, {
		...entries,
		[key]: { ...entries[key], hidden },
	});
}

/** Removes a tracked gist entry from the pointer gist file. No-ops silently if the gist isn't tracked. */
async function removePointerGistEntry(
	token: string,
	gistId: string,
): Promise<void> {
	const entries = await fetchPointerGistEntriesAuth(token);
	const key = Object.keys(entries).find((k) => entries[k].id === gistId);
	if (!key) return;
	const { [key]: _removed, ...remaining } = entries;
	await patchPointerGist(token, remaining);
}

/**
 * Registers a new gist in the pointer gist file if it isn't already tracked.
 * No-ops silently if the gist ID is already present.
 */
export async function registerPointerGistEntry(
	token: string,
	gistId: string,
	folderName: string,
	_filenames: string[],
	hidden: boolean,
	image?: string,
): Promise<void> {
	const entries = await fetchPointerGistEntriesAuth(token);
	const gist = await getGist(token, gistId);
	const gistFilenames = Object.keys(gist.files);
	const trimmedName = folderName.trim();
	const trimmedImage = image?.trim();
	const existingEntry = Object.entries(entries).find(
		([, entry]) => entry.id === gistId,
	)?.[1];

	const draft: PointerGistEntry = {
		...(existingEntry ?? { id: gistId, hidden, articles: [] }),
		id: gistId,
		hidden,
		...(trimmedImage ? { image: trimmedImage } : {}),
	};

	const { entry: normalized } = normalizePointerEntryFromGist(draft, gistFilenames);
	const withoutGist = Object.fromEntries(
		Object.entries(entries).filter(([, entry]) => entry.id !== gistId),
	);

	await patchPointerGist(token, {
		...withoutGist,
		[trimmedName]: normalized,
	});
}

/**
 * Moves or consolidates a pointer gist entry to a new folder name,
 * removing duplicate keys that reference the same gist ID.
 */
export async function movePointerGistEntry(
	token: string,
	gistId: string,
	oldFolderName: string,
	newFolderName: string,
	hidden: boolean,
): Promise<void> {
	const entries = await fetchPointerGistEntriesAuth(token);
	const gist = await getGist(token, gistId);
	const gistFilenames = Object.keys(gist.files);
	const trimmedNew = newFolderName.trim();
	const trimmedOld = oldFolderName.trim();
	const existing =
		Object.entries(entries).find(([, entry]) => entry.id === gistId)?.[1] ??
		entries[trimmedOld];

	if (!existing) {
		await registerPointerGistEntry(
			token,
			gistId,
			trimmedNew,
			gistFilenames,
			hidden,
		);
		return;
	}

	const { entry: normalized } = normalizePointerEntryFromGist(
		{ ...existing, hidden },
		gistFilenames,
	);
	const withoutGist = Object.fromEntries(
		Object.entries(entries).filter(([, entry]) => entry.id !== gistId),
	);

	await patchPointerGist(token, {
		...withoutGist,
		[trimmedNew]: normalized,
	});
}

/**
 * Re-fetches the gist's current file list and syncs both `articles` and `hidden`
 * in the pointer gist entry. No-ops silently if the gist isn't tracked.
 */
export async function syncPointerGistEntry(
	token: string,
	gistId: string,
	hidden: boolean,
	orderUpdates: PointerGistArticle[] = [],
): Promise<void> {
	const entries = await fetchPointerGistEntriesAuth(token);
	const key = Object.keys(entries).find((k) => entries[k].id === gistId);
	if (!key) return;
	const gist = await getGist(token, gistId);
	const { entry: normalized, orphanImages } = normalizePointerEntryFromGist(
		{ ...entries[key], hidden },
		Object.keys(gist.files),
		orderUpdates,
	);
	await deleteOrphanImagesFromGist(token, gistId, orphanImages);
	await patchPointerGist(token, {
		...entries,
		[key]: normalized,
	});
}

/**
 * Full reconciliation: fetches all user gists and the current pointer gist entries
 * in parallel, then rewrites every tracked entry's `articles` list to match the
 * actual gist state. Entries whose gist can't be found in the current page are
 * left unchanged. The `hidden` value for the gist being saved is applied; all
 * other entries preserve their existing `hidden` value.
 */
export async function reconcilePointerGist(
	token: string,
	updatedGistId: string,
	hidden: boolean,
	orderUpdates: PointerGistArticle[] = [],
): Promise<void> {
	const [entries, gists, freshUpdatedGist] = await Promise.all([
		fetchPointerGistEntriesAuth(token),
		listAllGists(token),
		getGist(token, updatedGistId),
	]);
	const gistMap = new Map(gists.map((g) => [g.id, g]));
	gistMap.set(updatedGistId, freshUpdatedGist);
	const updated: Record<string, PointerGistEntry> = {};

	for (const [key, entry] of Object.entries(entries)) {
		const gist = gistMap.get(entry.id);
		if (!gist) {
			updated[key] = entry;
			continue;
		}

		const { entry: normalized, orphanImages } = normalizePointerEntryFromGist(
			{
				...entry,
				hidden: entry.id === updatedGistId ? hidden : entry.hidden,
			},
			Object.keys(gist.files),
			entry.id === updatedGistId ? orderUpdates : [],
		);
		await deleteOrphanImagesFromGist(token, entry.id, orphanImages);
		updated[key] = normalized;
	}

	await patchPointerGist(token, updated);
}

export interface ArticlePageImageInput {
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

	const entries = await fetchPointerGistEntriesAuth(token);
	const key = Object.keys(entries).find((k) => entries[k].id === gistId);
	if (!key) {
		throw new Error(
			'Article is not registered in the pointer gist. Save a note first or register the article.',
		);
	}

	const entry = entries[key];
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
	let nextImage: string | undefined = entry.image;

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

	const entryForNormalize: PointerGistEntry = { ...entry };
	if (nextImage) {
		entryForNormalize.image = nextImage;
		entryForNormalize.imageUpdatedAt = gist.updated_at;
	} else {
		delete entryForNormalize.image;
		delete entryForNormalize.imageUpdatedAt;
	}

	const { entry: normalized, orphanImages } = normalizePointerEntryFromGist(
		entryForNormalize,
		remainingFilenames,
	);

	await deleteOrphanImagesFromGist(token, gistId, orphanImages);

	await patchPointerGist(token, {
		...entries,
		[key]: normalized,
	});
}

export async function fetchPointerGistEntryByFolderName(
	folderName: string,
): Promise<PointerGistEntry | undefined> {
	const entries = await fetchPointerGistEntries();
	return findPointerGistEntryByFolderName(entries, folderName)?.entry;
}

export async function fetchPointerGistEntryByFolderNameAuth(
	token: string,
	folderName: string,
): Promise<PointerGistEntry | undefined> {
	const entries = await fetchPointerGistEntriesAuth(token);
	return findPointerGistEntryByFolderName(entries, folderName)?.entry;
}

function findGistByFolderName(
	gists: Gist[],
	folderName: string,
): Gist | undefined {
	const normalized = folderName.trim().toLowerCase();
	return gists.find(
		(gist) => (gist.description ?? gist.id).trim().toLowerCase() === normalized,
	);
}

function gistHasFile(gist: Gist, filename: string): boolean {
	const normalized = filename.trim().toLowerCase();
	return Object.values(gist.files).some(
		(file) => file.filename.trim().toLowerCase() === normalized,
	);
}

export function isPointerGistFolder(folder: Pick<Folder, 'id'>): boolean {
	return folder.id === POINTER_GIST_ID;
}

export async function fetchGitHubUser(token: string): Promise<GitHubUser> {
	return githubFetch<GitHubUser>(token, '/user');
}

export async function listFolders(
	token: string,
	_options: ListFoldersOptions = {},
): Promise<Folder[]> {
	const [gists, entries] = await Promise.all([
		listAllGists(token),
		fetchPointerGistEntriesAuth(token).catch(
			() => ({} as Record<string, PointerGistEntry>),
		),
	]);

	const trackedIds = new Set(Object.values(entries).map((entry) => entry.id));
	const nameByGistId = new Map(
		Object.entries(entries).map(([name, entry]) => [entry.id, name.trim()]),
	);

	const byName = new Map<string, Folder>();

	for (const gist of gists) {
		if (gist.id === POINTER_GIST_ID) continue;

		const folder = gistToFolder(gist);
		const trackedName = nameByGistId.get(gist.id);
		if (trackedName) {
			folder.name = trackedName;
		}

		const nameKey = folder.name.trim().toLowerCase();
		const existing = byName.get(nameKey);
		if (!existing) {
			byName.set(nameKey, folder);
			continue;
		}

		const existingTracked = trackedIds.has(existing.id);
		const currentTracked = trackedIds.has(folder.id);
		if (currentTracked && !existingTracked) {
			byName.set(nameKey, folder);
		} else if (!currentTracked && !existingTracked) {
			if (folder.updatedAt > existing.updatedAt) {
				byName.set(nameKey, folder);
			}
		}
	}

	return Array.from(byName.values());
}

export async function getFolder(
	token: string,
	folderId: string,
): Promise<Folder> {
	const gist = await getGist(token, folderId);
	return gistToFolder(gist);
}

export async function listNotesInFolder(
	token: string,
	folderId: string,
): Promise<Note[]> {
	const gist = await getGist(token, folderId);
	return gistToNotes(gist);
}

export async function getNote(
	token: string,
	folderId: string,
	filename: string,
): Promise<Note | null> {
	const gist = await getGist(token, folderId);
	const file = gist.files[filename];
	if (!file) return null;
	return {
		folderId: gist.id,
		filename: file.filename,
		content: file.content ?? '',
		updatedAt: gist.updated_at,
	};
}

export interface UpdateNoteInput {
	folderId: string;
	filename: string;
	content: string;
	newFilename?: string;
	/** When set and different from the source folder, the note is moved. */
	newFolder?: string;
}

export async function updateNote(
	token: string,
	input: UpdateNoteInput,
): Promise<Note> {
	const filename = input.filename.trim();
	const newFilename = (input.newFilename ?? input.filename).trim();
	const newFolder = input.newFolder?.trim();

	const sourceGist = await getGist(token, input.folderId);
	const sourceFolderName = (sourceGist.description ?? sourceGist.id).trim();
	const isFolderChange =
		!!newFolder && newFolder.toLowerCase() !== sourceFolderName.toLowerCase();

	if (isFolderChange) {
		const gists = await listAllGists(token);
		const targetGist = findGistByFolderName(gists, newFolder!);

		if (targetGist && gistHasFile(targetGist, newFilename)) {
			throw new Error(
				`${newFilename} already exists in folder "${newFolder}".`,
			);
		}

		if (!targetGist) {
			const gist = await createGist(token, {
				description: newFolder!,
				files: { [newFilename]: { content: input.content } },
				isSecret: true, // always create secret gists
			});
			const updatedSource = await updateGist(token, input.folderId, {
				files: { [filename]: null },
			});
			const sourceFilenamesAfterMove = Object.keys(sourceGist.files).filter(
				(f) => f.toLowerCase() !== filename.toLowerCase(),
			);
			await syncPointerGistArticles(
				token,
				updatedSource.id,
				sourceFilenamesAfterMove,
			).catch((err) => console.warn('Pointer gist sync failed:', err));
			return {
				folderId: gist.id,
				filename: newFilename,
				content: input.content,
				updatedAt: gist.updated_at,
			};
		}

		const updatedTarget = await updateGist(token, targetGist.id, {
			files: { [newFilename]: { content: input.content } },
		});
		const updatedSource = await updateGist(token, input.folderId, {
			files: { [filename]: null },
		});
		const targetFilenamesAfterMove = [
			...Object.keys(targetGist.files),
			newFilename,
		];
		const sourceFilenamesAfterMove = Object.keys(sourceGist.files).filter(
			(f) => f.toLowerCase() !== filename.toLowerCase(),
		);
		await syncPointerGistArticles(
			token,
			updatedTarget.id,
			targetFilenamesAfterMove,
		).catch((err) => console.warn('Pointer gist sync failed:', err));
		await syncPointerGistArticles(
			token,
			updatedSource.id,
			sourceFilenamesAfterMove,
		).catch((err) => console.warn('Pointer gist sync failed:', err));

		return {
			folderId: updatedTarget.id,
			filename: newFilename,
			content: input.content,
			updatedAt: updatedTarget.updated_at,
		};
	}

	const files: Record<string, { content: string } | null> = {};

	if (newFilename.toLowerCase() !== filename.toLowerCase()) {
		if (gistHasFile(sourceGist, newFilename)) {
			throw new Error(`${newFilename} already exists in this folder.`);
		}
		files[filename] = null;
		files[newFilename] = { content: input.content };
	} else {
		files[filename] = { content: input.content };
	}

	const gist = await updateGist(token, input.folderId, { files });
	if (newFilename.toLowerCase() !== filename.toLowerCase()) {
		const updatedFilenames = Object.keys(sourceGist.files).map((f) =>
			f.toLowerCase() === filename.toLowerCase() ? newFilename : f,
		);
		await syncPointerGistArticles(token, gist.id, updatedFilenames, {
			renamedFrom: filename,
			renamedTo: newFilename,
		}).catch((err) => console.warn('Pointer gist sync failed:', err));
	}
	const resultFilename =
		newFilename.toLowerCase() !== filename.toLowerCase()
			? newFilename
			: filename;
	const file = gist.files[resultFilename];

	return {
		folderId: gist.id,
		filename: file?.filename ?? resultFilename,
		content: file?.content ?? input.content,
		updatedAt: gist.updated_at,
	};
}

export async function saveNote(
	token: string,
	input: SaveNoteInput,
): Promise<Note> {
	const folderName = input.folder.trim();
	const filename = input.filename.trim();

	const gists = await listAllGists(token);
	const existing = findGistByFolderName(gists, folderName);

	if (existing && gistHasFile(existing, filename)) {
		throw new Error(`${filename} already exists in folder "${folderName}".`);
	}

	if (!existing) {
		const gist = await createGist(token, {
			description: folderName,
			files: { [filename]: { content: input.content } },
			isSecret: true, // always create secret gists
		});
		return {
			folderId: gist.id,
			filename,
			content: input.content,
			updatedAt: gist.updated_at,
		};
	}


	const allFilenames = [...Object.keys(existing.files), filename];
	const gist = await updateGist(token, existing.id, {
		files: { [filename]: { content: input.content } },
	});
	await syncPointerGistArticles(token, gist.id, allFilenames).catch((err) =>
		console.warn('Pointer gist sync failed:', err),
	);
	const file = gist.files[filename];
	return {
		folderId: gist.id,
		filename: file?.filename ?? filename,
		content: file?.content ?? input.content,
		updatedAt: gist.updated_at,
	};
}

export async function deleteNote(
	token: string,
	folderId: string,
	filename: string,
): Promise<void> {
	const fullGist = await getGist(token, folderId);
	const remainingFilenames = Object.keys(fullGist.files).filter(
		(f) => f.toLowerCase() !== filename.toLowerCase(),
	);

	// GitHub rejects a PATCH that would leave a gist with no files (422).
	// Delete the whole gist only when no files would remain (including page image).
	if (remainingFilenames.length === 0) {
		await deleteGist(token, folderId);
		await removePointerGistEntry(token, folderId).catch((err) =>
			console.warn('Pointer gist remove failed:', err),
		);
		return;
	}

	await updateGist(token, folderId, { files: { [filename]: null } });
	await syncPointerGistArticles(token, folderId, remainingFilenames).catch(
		(err) => console.warn('Pointer gist sync failed:', err),
	);
}

export async function deleteFolder(
	token: string,
	folderId: string,
): Promise<void> {
	await deleteGist(token, folderId);
	await removePointerGistEntry(token, folderId).catch((err) =>
		console.warn('Pointer gist remove failed:', err),
	);
}

export async function listFolderRevisions(
	token: string,
	folderId: string,
): Promise<FolderRevision[]> {
	const commits = await githubFetch<GistCommit[]>(
		token,
		`/gists/${folderId}/commits`,
	);
	return commits.map((commit) => ({
		version: commit.version,
		committedAt: commit.committed_at,
		changeStatus: commit.change_status,
	}));
}
