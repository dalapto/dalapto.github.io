import type {
	Folder,
	FolderRevision,
	GitHubUser,
	ListFoldersOptions,
	Note,
	SaveNoteInput,
} from '../types/github.types';

const GITHUB_API_BASE = 'https://api.github.com';

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
	input: { description: string; files: Record<string, { content: string }> },
): Promise<Gist> {
	return githubFetch<Gist>(token, '/gists', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ ...input, public: false }),
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

function findGistByFolderName(gists: Gist[], folderName: string): Gist | undefined {
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

export async function getFolder(token: string, folderId: string): Promise<Folder> {
	const gist = await getGist(token, folderId);
	return gistToFolder(gist);
}

export async function listNotesInFolder(token: string, folderId: string): Promise<Note[]> {
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

export async function updateNote(token: string, input: UpdateNoteInput): Promise<Note> {
	const filename = input.filename.trim();
	const newFilename = (input.newFilename ?? input.filename).trim();
	const newFolder = input.newFolder?.trim();

	if (!filename) throw new Error('Filename is required');
	if (!newFilename) throw new Error('Filename is required');

	const sourceGist = await getGist(token, input.folderId);
	const sourceFolderName = (sourceGist.description ?? sourceGist.id).trim();
	const isFolderChange =
		!!newFolder && newFolder.toLowerCase() !== sourceFolderName.toLowerCase();

	if (isFolderChange) {
		const gists = await listGists(token);
		const targetGist = findGistByFolderName(gists, newFolder!);

		if (targetGist && gistHasFile(targetGist, newFilename)) {
			throw new Error(
				`A note named "${newFilename}" already exists in folder "${newFolder}".`,
			);
		}

		if (!targetGist) {
			const gist = await createGist(token, {
				description: newFolder!,
				files: { [newFilename]: { content: input.content } },
			});
			await updateGist(token, input.folderId, { files: { [filename]: null } });
			return {
				folderId: gist.id,
				filename: newFilename,
				content: input.content,
				updatedAt: gist.updated_at,
			};
		}

		await updateGist(token, targetGist.id, {
			files: { [newFilename]: { content: input.content } },
		});
		await updateGist(token, input.folderId, { files: { [filename]: null } });
		const updatedTarget = await getGist(token, targetGist.id);

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
			throw new Error(
				`A note named "${newFilename}" already exists in this folder.`,
			);
		}
		files[filename] = null;
		files[newFilename] = { content: input.content };
	} else {
		files[filename] = { content: input.content };
	}

	const gist = await updateGist(token, input.folderId, { files });
	const resultFilename =
		newFilename.toLowerCase() !== filename.toLowerCase() ? newFilename : filename;
	const file = gist.files[resultFilename];

	return {
		folderId: gist.id,
		filename: file?.filename ?? resultFilename,
		content: file?.content ?? input.content,
		updatedAt: gist.updated_at,
	};
}

export async function saveNote(token: string, input: SaveNoteInput): Promise<Note> {
	const folderName = input.folder.trim();
	const filename = input.filename.trim();
	if (!folderName) throw new Error('Folder name is required');
	if (!filename) throw new Error('Filename is required');

	const gists = await listGists(token);
	const existing = findGistByFolderName(gists, folderName);

	if (existing && gistHasFile(existing, filename)) {
		throw new Error(
			`A note named "${filename}" already exists in folder "${folderName}".`,
		);
	}

	if (!existing) {
		const gist = await createGist(token, {
			description: folderName,
			files: { [filename]: { content: input.content } },
		});
		return {
			folderId: gist.id,
			filename,
			content: input.content,
			updatedAt: gist.updated_at,
		};
	}

	const gist = await updateGist(token, existing.id, {
		files: { [filename]: { content: input.content } },
	});
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
	await updateGist(token, folderId, { files: { [filename]: null } });
}

export async function deleteFolder(token: string, folderId: string): Promise<void> {
	await deleteGist(token, folderId);
}

export async function listFolderRevisions(
	token: string,
	folderId: string,
): Promise<FolderRevision[]> {
	const commits = await githubFetch<GistCommit[]>(token, `/gists/${folderId}/commits`);
	return commits.map((commit) => ({
		version: commit.version,
		committedAt: commit.committed_at,
		changeStatus: commit.change_status,
	}));
}
