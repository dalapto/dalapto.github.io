import type {
	Folder,
	FolderRevision,
	GitHubUser,
	ListFoldersOptions,
	Note,
	SaveNoteInput,
} from '../types/github.types';

const GITHUB_API_BASE = 'https://api.github.com';
const GIST_RAW_BASE = 'https://gist.githubusercontent.com';

const POINTER_GIST_ID = '7d48f1881df7e46bf6e0425b50666131';
const POINTER_GIST_OWNER = 'dalapto';
const POINTER_GIST_FILENAME = 'PointerGistIDs.json';

/** Shape of each entry in the pointer gist file. */
export interface PointerGistEntry {
	id: string;
	hidden: boolean;
	files: string[];
}

interface GistFile {
	filename: string;
	content?: string;
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
	if (!res.ok) throw new Error(`GitHub API error: ${res.status} ${path}`);
	if (res.status === 204) return undefined as T;
	return res.json() as Promise<T>;
}

function gistToFolder(gist: Gist): Folder {
	return {
		id: gist.id,
		name: gist.description ?? gist.id,
		updatedAt: gist.updated_at,
		htmlUrl: gist.html_url,
		noteFilenames: Object.values(gist.files).map((file) => file.filename),
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
	return res.json() as Promise<Record<string, PointerGistEntry>>;
}

export async function fetchPublicGistFiles(
	gistId: string,
	filenames: string[],
): Promise<Array<{ filename: string; content: string }>> {
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
	return results.sort((a, b) => a.filename.localeCompare(b.filename));
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
async function fetchPointerGistEntriesAuth(
	token: string,
): Promise<Record<string, PointerGistEntry>> {
	const gist = await getGist(token, POINTER_GIST_ID);
	const file = gist.files[POINTER_GIST_FILENAME];
	if (!file?.content) throw new Error('Pointer gist file not found or empty');
	return JSON.parse(file.content) as Record<string, PointerGistEntry>;
}

/** Updates the `files` list for a tracked gist, preserving its existing `hidden` value. No-ops silently if the gist isn't tracked. */
async function syncPointerGistFiles(
	token: string,
	gistId: string,
	filenames: string[],
): Promise<void> {
	const entries = await fetchPointerGistEntriesAuth(token);
	const key = Object.keys(entries).find((k) => entries[k].id === gistId);
	if (!key) return;
	await patchPointerGist(token, {
		...entries,
		[key]: { ...entries[key], id: gistId, files: filenames },
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
	filenames: string[],
	hidden: boolean,
): Promise<void> {
	const entries = await fetchPointerGistEntriesAuth(token);
	const alreadyTracked = Object.values(entries).some((e) => e.id === gistId);
	if (alreadyTracked) return;
	await patchPointerGist(token, {
		...entries,
		[folderName]: { id: gistId, hidden, files: filenames },
	});
}

/**
 * Re-fetches the gist's current file list and syncs both `files` and `hidden`
 * in the pointer gist entry. No-ops silently if the gist isn't tracked.
 */
export async function syncPointerGistEntry(
	token: string,
	gistId: string,
	hidden: boolean,
): Promise<void> {
	const entries = await fetchPointerGistEntriesAuth(token);
	const key = Object.keys(entries).find((k) => entries[k].id === gistId);
	if (!key) return;
	const gist = await getGist(token, gistId);
	const filenames = Object.keys(gist.files);
	await patchPointerGist(token, {
		...entries,
		[key]: { ...entries[key], hidden, files: filenames },
	});
}

/**
 * Full reconciliation: fetches all user gists and the current pointer gist entries
 * in parallel, then rewrites every tracked entry's `files` list to match the
 * actual gist state. Entries whose gist can't be found in the current page are
 * left unchanged. The `hidden` value for the gist being saved is applied; all
 * other entries preserve their existing `hidden` value.
 */
export async function reconcilePointerGist(
	token: string,
	updatedGistId: string,
	hidden: boolean,
): Promise<void> {
	const [entries, gists] = await Promise.all([
		fetchPointerGistEntriesAuth(token),
		listGists(token, { perPage: 100 }),
	]);
	const gistMap = new Map(gists.map((g) => [g.id, g]));
	const updated: Record<string, PointerGistEntry> = {};
	for (const [key, entry] of Object.entries(entries)) {
		const gist = gistMap.get(entry.id);
		updated[key] = gist
			? {
					...entry,
					hidden: entry.id === updatedGistId ? hidden : entry.hidden,
					files: Object.keys(gist.files),
			  }
			: entry;
	}
	await patchPointerGist(token, updated);
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
	options: ListFoldersOptions = {},
): Promise<Folder[]> {
	const gists = await listGists(token, options);
	return gists.map(gistToFolder);
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
		const gists = await listGists(token);
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
			await syncPointerGistFiles(
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
		await syncPointerGistFiles(
			token,
			updatedTarget.id,
			targetFilenamesAfterMove,
		).catch((err) => console.warn('Pointer gist sync failed:', err));
		await syncPointerGistFiles(
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
		await syncPointerGistFiles(token, gist.id, updatedFilenames).catch((err) =>
			console.warn('Pointer gist sync failed:', err),
		);
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

	const gists = await listGists(token);
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
	await syncPointerGistFiles(token, gist.id, allFilenames).catch((err) =>
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
	// Delete the whole gist when this is the last note in the folder.
	if (remainingFilenames.length === 0) {
		await deleteGist(token, folderId);
		await removePointerGistEntry(token, folderId).catch((err) =>
			console.warn('Pointer gist remove failed:', err),
		);
		return;
	}

	await updateGist(token, folderId, { files: { [filename]: null } });
	await syncPointerGistFiles(token, folderId, remainingFilenames).catch((err) =>
		console.warn('Pointer gist sync failed:', err),
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
