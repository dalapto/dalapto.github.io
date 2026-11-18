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
	GitHubApiError,
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
async function mutatePointerGist(
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

function findPointerKeyByGistId(
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

/** Pure: entries with `gistId` (re)registered under `folderName`, keeping its articles/order/image. */
function withRegisteredEntry(
	entries: PointerEntries,
	gistId: string,
	folderName: string,
	hidden: boolean,
): PointerEntries {
	const existingEntry = Object.values(entries).find((entry) => entry.id === gistId);
	const entry: PointerGistEntry = {
		...(existingEntry ?? { id: gistId, articles: [] }),
		id: gistId,
		hidden,
	};
	const withoutGist = Object.fromEntries(
		Object.entries(entries).filter(([, other]) => other.id !== gistId),
	);
	return { ...withoutGist, [folderName.trim()]: entry };
}

/** Updates the article list for a tracked gist, preserving order where possible. No-ops silently if the gist isn't tracked. */
export async function syncPointerGistArticles(
	token: string,
	gistId: string,
	filenames: string[],
): Promise<void> {
	await mutatePointerGist(token, (entries) => {
		const key = findPointerKeyByGistId(entries, gistId);
		if (!key) return null;
		const { entry: normalized } = normalizePointerEntryFromGist(
			entries[key],
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

/** Page-image fields for the saved article (from uploadArticlePageImage). `image: undefined` = removed. */
export interface PointerImageChange {
	image?: string;
	imageUpdatedAt?: string;
}

/** Everything one article save needs to record in the Writing index. */
export interface ArticleCommit {
	/** Gist the article's sections now live in. */
	gistId: string;
	/** Article name — the pointer key. */
	folderName: string;
	hidden: boolean;
	/** Explicit section orders to apply (e.g. from the Order field). */
	orderUpdates?: PointerGistArticle[];
	/** A section file renamed within the same gist — keeps its order. */
	rename?: { from: string; to: string };
	/** Page-image change from uploadArticlePageImage(); omit when unchanged. */
	imageChange?: PointerImageChange;
}

/**
 * Of the gists the index tracks but the listing didn't return, which are
 * confirmed deleted (404)? Any other failure keeps the entry, to be safe.
 */
async function findDeletedGistIds(
	token: string,
	trackedIds: string[],
	listed: Map<string, Gist>,
): Promise<Set<string>> {
	const missing = [...new Set(trackedIds)].filter((id) => !listed.has(id));
	const deleted = await Promise.all(
		missing.map(async (id) => {
			try {
				await getGist(token, id);
				return null;
			} catch (error) {
				return error instanceof GitHubApiError && error.status === 404 ? id : null;
			}
		}),
	);
	return new Set(deleted.filter((id): id is string => id !== null));
}

/**
 * Records one article save in the Writing index with a **single** write:
 *  - registers/moves the saved gist under `folderName` with `hidden`
 *  - applies the page-image change, section rename and order updates
 *  - re-syncs every entry's article list with its gist's actual files
 *  - drops entries whose gist no longer exists (404)
 * Orphaned page images are deleted after the write succeeds.
 */
export async function commitArticleToPointer(
	token: string,
	commit: ArticleCommit,
): Promise<void> {
	const { gistId, folderName, hidden, orderUpdates = [], rename, imageChange } =
		commit;

	// Network reads first — the mutation below must be pure (it may re-run).
	const [gists, savedGist, trackedBefore] = await Promise.all([
		listAllGists(token),
		getGist(token, gistId),
		fetchPointerGistEntriesAuth(token),
	]);
	const gistMap = new Map(gists.map((g) => [g.id, g]));
	gistMap.set(gistId, savedGist);
	const deletedIds = await findDeletedGistIds(
		token,
		Object.values(trackedBefore).map((entry) => entry.id),
		gistMap,
	);

	let orphansByGist = new Map<string, string[]>();

	const written = await mutatePointerGist(token, (entries) => {
		orphansByGist = new Map();
		const registered = withRegisteredEntry(entries, gistId, folderName, hidden);
		const updated: PointerEntries = {};

		for (const [key, entry] of Object.entries(registered)) {
			if (deletedIds.has(entry.id)) continue;

			const gist = gistMap.get(entry.id);
			if (!gist) {
				updated[key] = entry;
				continue;
			}

			let draft = entry;
			if (entry.id === gistId) {
				draft = { ...entry };
				if (rename) {
					draft.articles = renameArticleInList(
						draft.articles,
						rename.from,
						rename.to,
					);
				}
				if (imageChange) {
					if (imageChange.image) {
						draft.image = imageChange.image;
						draft.imageUpdatedAt = imageChange.imageUpdatedAt;
					} else {
						delete draft.image;
						delete draft.imageUpdatedAt;
					}
				}
			}

			const { entry: normalized, orphanImages } = normalizePointerEntryFromGist(
				draft,
				Object.keys(gist.files),
				entry.id === gistId ? orderUpdates : [],
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
