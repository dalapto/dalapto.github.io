import type { GitHubUser, ListFoldersOptions } from '../../types/github.types';
import { GITHUB_API_BASE } from './config';

// Low-level GitHub REST client and gist helpers. No pointer-gist or notes logic.

interface GistFile {
	filename: string;
	content?: string;
	encoding?: 'base64' | 'utf-8';
	truncated?: boolean;
	raw_url?: string;
	size?: number;
	type?: string;
}

export interface Gist {
	id: string;
	html_url: string;
	description: string | null;
	updated_at: string;
	files: Record<string, GistFile>;
	/** Revision history, newest first (present on single-gist responses). */
	history?: Array<{ version: string }>;
}

/** A non-2xx response from the GitHub API, with its HTTP status. */
export class GitHubApiError extends Error {
	readonly status: number;

	constructor(message: string, status: number) {
		super(message);
		this.name = 'GitHubApiError';
		this.status = status;
	}
}

export async function githubFetch<T>(
	token: string,
	path: string,
	init?: RequestInit,
): Promise<T> {
	const res = await fetch(`${GITHUB_API_BASE}${path}`, {
		// GitHub sends `Cache-Control: max-age=60`; without this a read straight
		// after a write can return the pre-save gist from the browser cache.
		cache: 'no-store',
		...init,
		headers: {
			Authorization: `Bearer ${token}`,
			Accept: 'application/vnd.github+json',
			...init?.headers,
		},
	});
	if (!res.ok) {
		const detail = (await res.text().catch(() => '')).slice(0, 300);
		throw new GitHubApiError(
			`GitHub API error: ${res.status} ${path}${detail ? ` — ${detail}` : ''}`,
			res.status,
		);
	}
	if (res.status === 204) return undefined as T;
	return res.json() as Promise<T>;
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

export async function listAllGists(token: string): Promise<Gist[]> {
	const all: Gist[] = [];
	for (let page = 1; ; page += 1) {
		const batch = await listGists(token, { perPage: 100, page });
		all.push(...batch);
		if (batch.length < 100) return all;
	}
}

export async function deleteOrphanImagesFromGist(
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

export async function getGist(token: string, gistId: string): Promise<Gist> {
	return githubFetch<Gist>(token, `/gists/${gistId}`);
}

export async function createGist(
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

export async function updateGist(
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

export async function deleteGist(token: string, gistId: string): Promise<void> {
	await githubFetch<void>(token, `/gists/${gistId}`, { method: 'DELETE' });
}

export function findGistFileByFilename(
	files: Record<string, GistFile>,
	filename: string,
): GistFile | undefined {
	const normalized = filename.trim().toLowerCase();
	return Object.values(files).find(
		(file) => file.filename.trim().toLowerCase() === normalized,
	);
}

export function findGistByFolderName(
	gists: Gist[],
	folderName: string,
): Gist | undefined {
	const normalized = folderName.trim().toLowerCase();
	return gists.find(
		(gist) => (gist.description ?? gist.id).trim().toLowerCase() === normalized,
	);
}

export function gistHasFile(gist: Gist, filename: string): boolean {
	const normalized = filename.trim().toLowerCase();
	return Object.values(gist.files).some(
		(file) => file.filename.trim().toLowerCase() === normalized,
	);
}

export async function fetchGitHubUser(token: string): Promise<GitHubUser> {
	return githubFetch<GitHubUser>(token, '/user');
}
