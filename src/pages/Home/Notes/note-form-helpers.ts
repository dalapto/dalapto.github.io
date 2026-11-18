import { getNote } from '../../../services/github/notes.service';
import {
	fetchPointerGistEntryByFolderNameAuth,
	isPointerGistFolder,
} from '../../../services/github/pointer-gist.service';
import type { Folder } from '../../../types/github.types';
import { filterArticleTextFilenames } from '../../../utils/article-page-image';
import { logErrorDetails } from '../../../utils/getErrorMessage';
import {
	findArticleByFilename,
	formatOrderInput,
} from '../../../utils/pointer-gist-articles';

// Pure helpers shared by the Create and Edit note panels.

/** "Chapter 1.txt" → "Chapter 1". */
function noteDisplayName(filename: string): string {
	return filename.replace(/\.txt$/i, '');
}

/** "Chapter 1" → "Chapter 1.txt" (trimmed); '' for a blank section. */
function sectionFilename(section: string): string {
	const trimmed = section.trim();
	return trimmed ? `${trimmed}.txt` : '';
}

/** The article (gist folder) with this name, ignoring case and surrounding spaces. */
function findFolderByName(folders: Folder[], name: string): Folder | undefined {
	const target = name.trim().toLowerCase();
	if (!target) return undefined;
	return folders.find((folder) => folder.name.trim().toLowerCase() === target);
}

/** Article names for the dropdowns: real articles only (not the pointer gist), de-duplicated. */
function getArticleOptions(folders: Folder[]): string[] {
	const names = folders
		.filter((folder) => !isPointerGistFolder(folder))
		.map((folder) => folder.name.trim())
		.filter(Boolean);
	return [...new Set(names)];
}

/** The stored filename of a section in `folder`, matched case-insensitively. */
function findNoteFilename(
	folder: Folder,
	displayName: string,
): string | undefined {
	const target = sectionFilename(displayName).toLowerCase();
	return folder.noteFilenames.find((name) => name.toLowerCase() === target);
}

/** Whether `folder` already has a section file called `filename` (case-insensitive). */
function sectionExists(folder: Folder | undefined, filename: string): boolean {
	if (!folder || !filename) return false;
	const target = filename.toLowerCase();
	return filterArticleTextFilenames(folder.noteFilenames).some(
		(name) => name.toLowerCase() === target,
	);
}

interface NoteWithOrder {
	filename: string;
	section: string;
	content: string;
	updatedAt: string;
	/** Order field value ('' when unset or unreadable). */
	order: string;
}

/**
 * Loads a section's text plus its order from the Writing index. A failed
 * order read is logged and treated as "no order" so the note still opens.
 * Returns null if the section no longer exists.
 */
async function fetchNoteWithOrder(
	token: string,
	folderId: string,
	filename: string,
	articleName: string,
): Promise<NoteWithOrder | null> {
	const note = await getNote(token, folderId, filename);
	if (!note) return null;

	let order = '';
	try {
		const entry = await fetchPointerGistEntryByFolderNameAuth(token, articleName);
		const article = entry
			? findArticleByFilename(entry.articles, note.filename)
			: undefined;
		order = formatOrderInput(article?.order);
	} catch (error) {
		logErrorDetails(error, 'Load section order');
	}

	return {
		filename: note.filename,
		section: noteDisplayName(note.filename),
		content: note.content,
		updatedAt: note.updatedAt,
		order,
	};
}

export {
	fetchNoteWithOrder,
	findFolderByName,
	findNoteFilename,
	getArticleOptions,
	noteDisplayName,
	sectionExists,
	sectionFilename,
	type NoteWithOrder,
};
