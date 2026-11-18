import { useCallback, useEffect, useRef, useState } from 'react';
import type { StorageSaveItem } from '../types/upload.types';

/**
 * The list behind an upload control (ImageUpload, FileUpload): items that are
 * either already stored or waiting to upload. Keeps a ref in sync with state
 * so the imperative handle always reads the latest list.
 */
function useStorageItemList<T extends StorageSaveItem>() {
	const itemsRef = useRef<T[]>([]);
	const [items, setItems] = useState<T[]>([]);

	const setAll = useCallback((next: T[]) => {
		itemsRef.current = next;
		setItems(next);
	}, []);

	const append = useCallback(
		(item: T) => setAll([...itemsRef.current, item]),
		[setAll],
	);

	const removeAt = useCallback(
		(index: number) => setAll(itemsRef.current.filter((_, i) => i !== index)),
		[setAll],
	);

	/** What the save needs: each slot's stored filename or pending file, in order. */
	const getSaveItems = useCallback(
		(): StorageSaveItem[] =>
			itemsRef.current.map(({ storageFilename, pendingFile }) => ({
				storageFilename,
				pendingFile,
			})),
		[],
	);

	/** After a save: record each slot's stored filename and drop the pending file. */
	const commitSavedFilenames = useCallback(
		(filenames: string[]) =>
			setAll(
				itemsRef.current.map((item, index) => ({
					...item,
					storageFilename: filenames[index] ?? item.storageFilename,
					pendingFile: undefined,
				})),
			),
		[setAll],
	);

	const reset = useCallback(() => setAll([]), [setAll]);

	return {
		items,
		itemsRef,
		setAll,
		append,
		removeAt,
		getSaveItems,
		commitSavedFilenames,
		reset,
	};
}

/**
 * Runs `load` when the stored list changes — keyed on the storage filenames,
 * not the array identity, so a caller passing a fresh array each render (or the
 * default `[]`) doesn't re-run it. Skipped for an empty list. `load` may return
 * a cleanup (e.g. to cancel an async load).
 */
function useStoredListEffect<S extends { storageFilename: string }>(
	list: S[],
	load: (list: S[]) => void | (() => void),
) {
	const latest = useRef({ list, load });
	latest.current = { list, load };
	const key = list.map((item) => item.storageFilename).join(',');

	useEffect(() => {
		const { list: current, load: run } = latest.current;
		if (current.length === 0) return;
		return run(current);
	}, [key]);
}

export { useStorageItemList, useStoredListEffect };
