import {
	CLIPBOARD_ROW_ID,
	type ClipboardRow,
	type TabId,
} from '../utils/clipboard-helpers';
import {
	type StorageSaveItem,
	removeFromBucketBestEffort,
	splitStorageFilenames,
	supabase,
	uploadStorageItems,
} from '../supabase/supabase-utils';

type ClipboardRowUpdate = Partial<ClipboardRow> & { last_tab: TabId };

export async function saveClipboardRow(
	updates: ClipboardRowUpdate,
): Promise<ClipboardRow> {
	const { data, error } = await supabase
		.from('clipboard')
		.upsert({ id: CLIPBOARD_ROW_ID, ...updates }, { onConflict: 'id' })
		.select('*')
		.single();

	if (error) throw error;

	return data as ClipboardRow;
}

type StorageColumn = 'image_filename' | 'file_filename';

/** The filenames currently saved on the server (not local state, which can be stale). */
async function fetchSavedFilenames(column: StorageColumn): Promise<string[]> {
	const { data, error } = await supabase
		.from('clipboard')
		.select(column)
		.eq('id', CLIPBOARD_ROW_ID)
		.maybeSingle<Pick<ClipboardRow, StorageColumn>>();

	if (error) throw error;
	return splitStorageFilenames(data?.[column]);
}

/**
 * Saves the image or file tab so the row never points at missing files:
 *  1. upload new files
 *  2. save the row (on failure, the new uploads are rolled back)
 *  3. only then delete files the row no longer references (best effort)
 * Returns the stored filename CSV.
 */
export async function saveClipboardStorage({
	bucket,
	column,
	items,
	updates,
}: {
	bucket: 'clipboard-images' | 'clipboard-files';
	column: StorageColumn;
	items: StorageSaveItem[];
	updates: ClipboardRowUpdate;
}): Promise<string | null> {
	const { filenamesCsv, uploaded } = await uploadStorageItems(bucket, items);

	let previous: string[];
	try {
		previous = await fetchSavedFilenames(column);
		await saveClipboardRow({ ...updates, [column]: filenamesCsv });
	} catch (error) {
		await removeFromBucketBestEffort(bucket, uploaded);
		throw error;
	}

	const next = new Set(splitStorageFilenames(filenamesCsv));
	await removeFromBucketBestEffort(
		bucket,
		previous.filter((filename) => !next.has(filename)),
	);

	return filenamesCsv;
}
