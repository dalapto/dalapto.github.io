export interface GitHubUser {
	id: number;
	login: string;
	name: string | null;
	email: string | null;
	avatar_url: string;
}

/** One folder = one GitHub gist, identified by `id`. */
export interface Folder {
	id: string;
	name: string;
	updatedAt: string;
	htmlUrl: string;
	noteFilenames: string[];
	isPublic: boolean;
}

/** One note = one file within a folder gist. */
export interface Note {
	folderId: string;
	filename: string;
	content: string;
	updatedAt: string;
}

export interface SaveNoteInput {
	/** Folder name; creates a new gist when no folder with this name exists. */
	folder: string;
	/** File name within the folder; must be unique within the folder. */
	filename: string;
	content: string;
	/** When true the underlying gist is created as public; defaults to false (private/secret). */
	isPublic?: boolean;
}

export interface ListFoldersOptions {
	since?: string;
	perPage?: number;
	page?: number;
}

export interface FolderRevision {
	version: string;
	committedAt: string;
	changeStatus: {
		total: number;
		additions: number;
		deletions: number;
	};
}
