import type { Folder } from '../../types/github.types';
import {
	findOrphanImageFilenames,
	findPageImageFilename,
} from '../../utils/article-page-image';
import {
	type PointerGistArticle,
	mergeArticlesWithGistFilenames,
	migrateLegacyArticles,
	renameArticleInList,
} from '../../utils/pointer-gist-articles';
import {
	type Gist,
	deleteOrphanImagesFromGist,
	getGist,
	githubFetch,
	listAllGists,
} from './github-api';
import {
	GIST_RAW_BASE,
	POINTER_GIST_FILENAME,
	POINTER_GIST_ID,
	POINTER_GIST_OWNER,
} from './config';

// The pointer gist (PointerGistIDs.json) is the Writing index: which article
// gists exist, their order, visibility and page image. All writes go through
// mutatePointerGist().

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

export function normalizePointerEntryFromGist(
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

export async function fetchPointerGistEntries(): Promise<
	Record<string, PointerGistEntry>
> {
	const url = `${GIST_RAW_BASE}/${POINTER_GIST_OWNER}/${POINTER_GIST_ID}/raw/${POINTER_GIST_FILENAME}?_=${Date.now()}`;
	const res = await fetch(url, { cache: 'no-store' });
	if (!res.ok) throw new Error(`Failed to fetch pointer gist: ${res.status}`);
	const parsed = (await res.json()) as Record<string, RawPointerGistEntry>;
	return normalizeStoredPointerGistEntries(parsed);
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

function parsePointerGistEntries(
	gist: Gist,
): Record<string, PointerGistEntry> {
	const file = gist.files[POINTER_GIST_FILENAME];
	if (!file?.content) throw new Error('Pointer gist file not found or empty');
	const parsed = JSON.parse(file.content) as Record<string, RawPointerGistEntry>;
	return dedupePointerGistEntries(normalizeStoredPointerGistEntries(parsed));
}

export async function fetchPointerGistEntriesAuth(
	token: string,
): Promise<Record<string, PointerGistEntry>> {
	return parsePointerGistEntries(await getGist(token, POINTER_GIST_ID));
}

// ── Pointer gist writes ─────────────────────────────────────────────────────
// Every pointer change is a read → modify → write of one shared JSON file, so
// overlapping writes can silently undo each other. Two protections:
//  1. A module-level queue serialises writes from this tab (double submit,
//     Create + Edit tabs, chained save steps).
//  2. Just before writing, the gist's latest revision is re-checked. If another
//     tab/device wrote in the meantime, the change is re-applied on top of the
//     fresh copy (up to POINTER_WRITE_MAX_ATTEMPTS times).
// Mutations must therefore be pure functions of `entries`: do network side
// effects (uploads, orphan deletes) before or after mutatePointerGist().
// Note: GitHub has no conditional PATCH for gists, so a tiny window between the
// re-check and the write remains.

const POINTER_WRITE_MAX_ATTEMPTS = 3;
let pointerWriteQueue: Promise<unknown> = Promise.resolve();

function withPointerWriteLock<T>(task: () => Promise<T>): Promise<T> {
	const run = pointerWriteQueue.then(task, task);
	pointerWriteQueue = run.catch(() => undefined);
	return run;
}

function gistRevision(gist: Gist): string {
	return gist.history?.[0]?.version ?? gist.updated_at;
}

/** Thrown when the pointer gist kept changing elsewhere during a write. */
class PointerGistConflictError extends Error {
	constructor() {
		super(
			'The Writing index was changed elsewhere (another tab or device) while saving. Please try again.',
		);
		this.name = 'PointerGistConflictError';
	}
}

type PointerEntries = Record<string, PointerGistEntry>;

/**
 * Applies `mutate` to the latest pointer entries and writes the result.
 * Return `null` from `mutate` to skip the write. Must not be called from inside
 * another mutation (the queue would wait on itself).
 */
export async function mutatePointerGist(
	token: string,
	mutate: (entries: PointerEntries) => PointerEntries | null,
): Promise<boolean> {
	return withPointerWriteLock(async () => {
		for (let attempt = 1; attempt <= POINTER_WRITE_MAX_ATTEMPTS; attempt += 1) {
			const gist = await getGist(token, POINTER_GIST_ID);
			const next = mutate(parsePointerGistEntries(gist));
			if (next === null) return false;

			const latest = await getGist(token, POINTER_GIST_ID);
			if (gistRevision(latest) !== gistRevision(gist)) continue;

			await patchPointerGist(token, next);
			return true;
		}
		throw new PointerGistConflictError();
	});
}

export function findPointerKeyByGistId(
	entries: PointerEntries,
	gistId: string,
): string | undefined {
	return Object.keys(entries).find((k) => entries[k].id === gistId);
}

async function deleteOrphanImagesByGist(
	token: string,
	orphansByGist: Map<string, string[]>,
): Promise<void> {
	await Promise.all(
		[...orphansByGist].map(([gistId, filenames]) =>
			deleteOrphanImagesFromGist(token, gistId, filenames),
		),
	);
}

/** Pure: entries with `gistId` (re)registered under `folderName`. */
function withRegisteredEntry(
	entries: PointerEntries,
	gistId: string,
	folderName: string,
	hidden: boolean,
	gistFilenames: string[],
	image?: string,
): PointerEntries {
	const trimmedImage = image?.trim();
	const existingEntry = Object.values(entries).find((entry) => entry.id === gistId);

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
	return { ...withoutGist, [folderName.trim()]: normalized };
}

/** Updates the article list for a tracked gist, preserving order where possible. No-ops silently if the gist isn't tracked. */
export async function syncPointerGistArticles(
	token: string,
	gistId: string,
	filenames: string[],
	options: { renamedFrom?: string; renamedTo?: string } = {},
): Promise<void> {
	await mutatePointerGist(token, (entries) => {
		const key = findPointerKeyByGistId(entries, gistId);
		if (!key) return null;
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
		return { ...entries, [key]: { ...normalized, id: gistId } };
	});
}

/** Removes a tracked gist entry from the pointer gist file. No-ops silently if the gist isn't tracked. */
export async function removePointerGistEntry(
	token: string,
	gistId: string,
): Promise<void> {
	await mutatePointerGist(token, (entries) => {
		const key = findPointerKeyByGistId(entries, gistId);
		if (!key) return null;
		const { [key]: _removed, ...remaining } = entries;
		return remaining;
	});
}

/**
 * Registers a gist in the pointer gist file under `folderName`, or updates its
 * existing entry (keeping its articles/order) and moves it to that key.
 */
export async function registerPointerGistEntry(
	token: string,
	gistId: string,
	folderName: string,
	_filenames: string[],
	hidden: boolean,
	image?: string,
): Promise<void> {
	const gistFilenames = Object.keys((await getGist(token, gistId)).files);
	await mutatePointerGist(token, (entries) =>
		withRegisteredEntry(entries, gistId, folderName, hidden, gistFilenames, image),
	);
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
	const gistFilenames = Object.keys((await getGist(token, gistId)).files);
	const trimmedNew = newFolderName.trim();
	const trimmedOld = oldFolderName.trim();

	await mutatePointerGist(token, (entries) => {
		const existing =
			Object.values(entries).find((entry) => entry.id === gistId) ??
			entries[trimmedOld];

		if (!existing) {
			return withRegisteredEntry(
				entries,
				gistId,
				trimmedNew,
				hidden,
				gistFilenames,
			);
		}

		const { entry: normalized } = normalizePointerEntryFromGist(
			{ ...existing, hidden },
			gistFilenames,
		);
		const withoutGist = Object.fromEntries(
			Object.entries(entries).filter(([, entry]) => entry.id !== gistId),
		);
		return { ...withoutGist, [trimmedNew]: normalized };
	});
}

/**
 * Full reconciliation: fetches all user gists, then rewrites every tracked
 * entry's `articles` list to match the actual gist state. Entries whose gist
 * can't be found are left unchanged. The `hidden` value for the gist being
 * saved is applied; all other entries preserve their existing `hidden` value.
 * Orphaned page images are deleted after the pointer write succeeds.
 */
export async function reconcilePointerGist(
	token: string,
	updatedGistId: string,
	hidden: boolean,
	orderUpdates: PointerGistArticle[] = [],
): Promise<void> {
	const [gists, freshUpdatedGist] = await Promise.all([
		listAllGists(token),
		getGist(token, updatedGistId),
	]);
	const gistMap = new Map(gists.map((g) => [g.id, g]));
	gistMap.set(updatedGistId, freshUpdatedGist);
	let orphansByGist = new Map<string, string[]>();

	const written = await mutatePointerGist(token, (entries) => {
		orphansByGist = new Map();
		const updated: PointerEntries = {};

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
			if (orphanImages.length > 0) orphansByGist.set(entry.id, orphanImages);
			updated[key] = normalized;
		}

		return updated;
	});

	if (written) await deleteOrphanImagesByGist(token, orphansByGist);
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

export function isPointerGistFolder(folder: Pick<Folder, 'id'>): boolean {
	return folder.id === POINTER_GIST_ID;
}
