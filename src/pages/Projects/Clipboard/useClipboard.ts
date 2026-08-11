import { useCallback, useEffect, useRef, useState } from 'react';
import type {
	FileUploadHandle,
	StoredFile,
} from '../../../components/controls/FileUpload/FileUpload';
import type {
	ImageUploadHandle,
	StoredImage,
} from '../../../components/controls/ImageUpload/ImageUpload';
import { useAuthRequest } from '../../../context/AuthRequestContext';
import { useBusy } from '../../../context/BusyContext';
import { useSupabase } from '../../../context/SupabaseContext';
import { ToastSeverity, useToast } from '../../../context/ToastProvider';
import { saveClipboardRow } from '../../../services/clipboard.service';
import {
	splitStorageFilenames,
	supabase,
	syncStorageFiles,
} from '../../../supabase/supabase-utils';
import type { ClipboardRow, TabId } from '../../../utils/clipboard-helpers';
import {
	getClipboardErrorMessage,
	parseTimestamp,
	toStoredFiles,
	toStoredImages,
} from '../../../utils/clipboard-helpers';

const TAB_LABELS: Record<TabId, string> = {
	text: 'Text',
	image: 'Image',
	file: 'File',
};

function useClipboard() {
	const { showToast } = useToast();
	const { user, authLoading } = useSupabase();
	const { requestAuth } = useAuthRequest();
	const { setBusy } = useBusy();
	const [lastTab, setLastTab] = useState<TabId>('text');
	const [textContent, setTextContent] = useState('');
	const [savedTextContent, setSavedTextContent] = useState('');
	const [savedImageFilenames, setSavedImageFilenames] = useState<string | null>(
		null,
	);
	const [savedFileFilenames, setSavedFileFilenames] = useState<string | null>(
		null,
	);
	const [loadedImages, setLoadedImages] = useState<StoredImage[]>([]);
	const [loadedFiles, setLoadedFiles] = useState<StoredFile[]>([]);
	const [lastUpdatedFile, setLastUpdatedFile] = useState(new Date(0));
	const [lastUpdatedImage, setLastUpdatedImage] = useState(new Date(0));
	const [lastUpdatedText, setLastUpdatedText] = useState(new Date(0));
	const [imageRevision, setImageRevision] = useState(0);
	const [fileRevision, setFileRevision] = useState(0);
	const [hasImageContent, setHasImageContent] = useState(false);
	const [hasFileContent, setHasFileContent] = useState(false);
	const imageUploadRef = useRef<ImageUploadHandle>(null);
	const fileUploadRef = useRef<FileUploadHandle>(null);
	const pendingSaveRef = useRef<{
		tab: TabId;
		save: () => Promise<void>;
	} | null>(null);

	const hasNoTextChanges = textContent === savedTextContent;
	const hasNoImageChanges = imageRevision === 0;
	const hasNoFileChanges = fileRevision === 0;

	const loadClipboard = useCallback(
		async (options?: { silent?: boolean }) => {
			if (!options?.silent) {
				setBusy(true, { variant: 'spinner', operation: 'fetch' });
			}
			try {
				const { data: row, error } = await supabase
					.from('clipboard')
					.select('*')
					.single<ClipboardRow>();

				if (error) {
					if (error.code !== 'PGRST116') {
						console.error(error);
						showToast(
							getClipboardErrorMessage(error),
							ToastSeverity.ERROR,
							error,
						);
					}
					return;
				}

				if (!row) return;

				const text = row.text_content ?? '';

				setLastTab(row.last_tab ?? 'text');
				setTextContent(text);
				setSavedTextContent(text);
				setLastUpdatedText(parseTimestamp(row.text_last_updated));
				setLastUpdatedImage(parseTimestamp(row.image_last_updated));
				setLastUpdatedFile(parseTimestamp(row.file_last_updated));
				setSavedImageFilenames(row.image_filename);
				setSavedFileFilenames(row.file_filename);
				setImageRevision(0);
				setFileRevision(0);
				const images = toStoredImages(row.image_filename);
				const files = toStoredFiles(row.file_filename);
				setLoadedImages(images);
				setLoadedFiles(files);
				setHasImageContent(images.length > 0);
				setHasFileContent(files.length > 0);

				if (!row.file_filename) fileUploadRef.current?.reset();
				if (!row.image_filename) imageUploadRef.current?.reset();
			} finally {
				if (!options?.silent) {
					setBusy(false);
				}
			}
		},
		[setBusy, showToast],
	);

	const refreshClipboard = useCallback(
		() => loadClipboard({ silent: true }),
		[loadClipboard],
	);

	async function performSave(tab: TabId, save: () => Promise<void>) {
		setBusy(true, { variant: 'progress', operation: 'save' });
		try {
			await save();
			showToast(
				`${TAB_LABELS[tab]} saved successfully.`,
				ToastSeverity.SUCCESS,
			);
		} catch (error) {
			console.error(error);
			showToast(getClipboardErrorMessage(error), ToastSeverity.ERROR, error);
		} finally {
			setBusy(false);
		}
	}

	async function withSave(tab: TabId, save: () => Promise<void>) {
		if (!user) {
			pendingSaveRef.current = { tab, save };
			requestAuth();
			return;
		}
		await performSave(tab, save);
	}

	function cancelPendingSave() {
		pendingSaveRef.current = null;
	}

	function flushPendingSave() {
		if (pendingSaveRef.current) {
			const pending = pendingSaveRef.current;
			pendingSaveRef.current = null;
			void performSave(pending.tab, pending.save);
		}
	}

	async function saveText() {
		await withSave('text', async () => {
			const now = new Date().toISOString();
			await saveClipboardRow({
				last_tab: 'text',
				text_content: textContent,
				text_last_updated: now,
			});
			setSavedTextContent(textContent);
			setLastUpdatedText(new Date(now));
			setLastTab('text');
		});
	}

	async function saveImage() {
		await withSave('image', async () => {
			const now = new Date().toISOString();
			const saveItems = imageUploadRef.current?.getSaveItems() ?? [];
			const imageFilenames = await syncStorageFiles({
				bucket: 'clipboard-images',
				savedFilenamesCsv: savedImageFilenames,
				items: saveItems,
			});

			await saveClipboardRow({
				last_tab: 'image',
				image_filename: imageFilenames,
				image_last_updated: now,
			});

			setSavedImageFilenames(imageFilenames);
			setLastUpdatedImage(new Date(now));
			setLastTab('image');
			setImageRevision(0);

			if (imageFilenames) {
				imageUploadRef.current?.commitSavedFilenames(
					splitStorageFilenames(imageFilenames),
				);
			} else {
				imageUploadRef.current?.reset();
			}
		});
	}

	async function saveFile() {
		await withSave('file', async () => {
			const now = new Date().toISOString();
			const saveItems = fileUploadRef.current?.getSaveItems() ?? [];
			const fileFilenames = await syncStorageFiles({
				bucket: 'clipboard-files',
				savedFilenamesCsv: savedFileFilenames,
				items: saveItems,
			});

			await saveClipboardRow({
				last_tab: 'file',
				file_filename: fileFilenames,
				file_last_updated: now,
			});

			setSavedFileFilenames(fileFilenames);
			setLastUpdatedFile(new Date(now));
			setLastTab('file');
			setFileRevision(0);

			if (fileFilenames) {
				fileUploadRef.current?.commitSavedFilenames(
					splitStorageFilenames(fileFilenames),
				);
			} else {
				setLoadedFiles([]);
				fileUploadRef.current?.reset();
			}
		});
	}

	function onImageChange() {
		setImageRevision((n) => n + 1);
		setHasImageContent(
			(imageUploadRef.current?.getPreviews()?.length ?? 0) > 0,
		);
	}

	function onFileChange() {
		setFileRevision((n) => n + 1);
		setHasFileContent((fileUploadRef.current?.getPreviews()?.length ?? 0) > 0);
	}

	function clearText() {
		setTextContent('');
	}

	function clearImage() {
		imageUploadRef.current?.reset();
		setLoadedImages([]);
		setHasImageContent(false);
		setImageRevision((n) => n + 1);
	}

	function clearFile() {
		fileUploadRef.current?.reset();
		setLoadedFiles([]);
		setHasFileContent(false);
		setFileRevision((n) => n + 1);
	}

	useEffect(() => {
		if (authLoading) return;
		if (user) {
			void loadClipboard();
		} else {
			setBusy(false);
		}
	}, [authLoading, user, loadClipboard, setBusy]);

	return {
		fileUploadRef,
		clearFile,
		clearImage,
		clearText,
		hasFileContent,
		hasImageContent,
		hasNoFileChanges,
		hasNoImageChanges,
		hasNoTextChanges,
		hasTextContent: textContent.length > 0,
		imageUploadRef,
		lastTab,
		lastUpdatedFile,
		lastUpdatedImage,
		lastUpdatedText,
		loadedFiles,
		loadedImages,
		textContent,
		cancelPendingSave,
		flushPendingSave,
		loadClipboard,
		refreshClipboard,
		onFileChange,
		onImageChange,
		saveFile,
		saveImage,
		saveText,
		setTextContent,
	};
}

export { useClipboard };
