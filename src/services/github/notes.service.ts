import type {
	Folder,
	ListFoldersOptions,
	Note,
	SaveNoteInput,
} from '../../types/github.types';
import { filterArticleTextFilenames } from '../../utils/article-page-image';
import {
	type Gist,
	createGist,
	deleteGist,
	findGistByFolderName,
	getGist,
	gistHasFile,
	listAllGists,
	updateGist,
} from './github-api';
import {
	type PointerGistEntry,
	fetchPointerGistEntriesAuth,
	isPointerGistFolder,
	removePointerGistEntry,
	syncPointerGistArticles,
} from './pointer-gist.service';
import { logErrorDetails } from '../../utils/getErrorMessage';

// Notes CRUD: one folder (article) = one gist, one note (section) = one file.

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

export async function listFolders(
	token: string,
	_options: ListFoldersOptions = {},
): Promise<Folder[]> {
	const [gists, entries] = await Promise.all([
		listAllGists(token),
		fetchPointerGistEntriesAuth(token).catch((error: unknown) => {
			// Still list the gists; they just show without Writing-index names.
			logErrorDetails(error, 'Read Writing index for folder list');
			return {} as Record<string, PointerGistEntry>;
		}),
	]);

	const trackedIds = new Set(Object.values(entries).map((entry) => entry.id));
	const nameByGistId = new Map(
		Object.entries(entries).map(([name, entry]) => [entry.id, name.trim()]),
	);

	const byName = new Map<string, Folder>();

	for (const gist of gists) {
		if (isPointerGistFolder(gist)) continue;

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

/**
 * Writes the note's gist file(s) — content, rename, or move to another article.
 * Does not touch the Writing index: follow with commitArticleToPointer().
 */
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
			await updateGist(token, input.folderId, {
				files: { [filename]: null },
			});
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
		await updateGist(token, input.folderId, {
			files: { [filename]: null },
		});

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

/**
 * Creates a note (and its article gist if new). Does not touch the Writing
 * index: follow with commitArticleToPointer().
 */
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

/**
 * Result of a delete. `indexWarning` is set when the note/gist was deleted but
 * the pointer gist (the public Writing index) couldn't be updated to match.
 */
export interface DeleteResult {
	indexWarning?: string;
}

const INDEX_UPDATE_FAILED_WARNING =
	"the Writing index couldn't be updated, so it may still show a broken link. Check the browser console for details.";

async function updateIndexAfterDelete(
	update: () => Promise<void>,
): Promise<DeleteResult> {
	try {
		await update();
		return {};
	} catch (error) {
		console.warn('Pointer gist update after delete failed:', error);
		return { indexWarning: INDEX_UPDATE_FAILED_WARNING };
	}
}

export async function deleteNote(
	token: string,
	folderId: string,
	filename: string,
): Promise<DeleteResult> {
	const fullGist = await getGist(token, folderId);
	const remainingFilenames = Object.keys(fullGist.files).filter(
		(f) => f.toLowerCase() !== filename.toLowerCase(),
	);

	// GitHub rejects a PATCH that would leave a gist with no files (422).
	// Delete the whole gist only when no files would remain (including page image).
	if (remainingFilenames.length === 0) {
		await deleteGist(token, folderId);
		return updateIndexAfterDelete(() => removePointerGistEntry(token, folderId));
	}

	await updateGist(token, folderId, { files: { [filename]: null } });
	return updateIndexAfterDelete(() =>
		syncPointerGistArticles(token, folderId, remainingFilenames),
	);
}
