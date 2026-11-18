import CloseIcon from '@mui/icons-material/Close';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import { forwardRef, useImperativeHandle, useRef } from 'react';
import { FILE_UPLOAD } from '../../../constants/upload-types';
import './FileUpload.css';
import { PdfPreview } from './PdfPreview';
import {
	useStorageItemList,
	useStoredListEffect,
} from '../../../hooks/useStorageItemList';
import type { StorageSaveItem, StoredFile } from '../../../types/upload.types';
import { logErrorDetails } from '../../../utils/getErrorMessage';

type FilePreview = {
	name: string;
	kind: 'pdf' | 'text' | 'other';
	content: string;
	storageFilename?: string;
	pendingFile?: File;
};

interface FileUploadHandle {
	trigger: () => void;
	download: () => Promise<void>;
	getPreviews: () => FilePreview[];
	getSaveItems: () => StorageSaveItem[];
	commitSavedFilenames: (filenames: string[]) => void;
	reset: () => void;
}

interface FileUploadProps {
	initialFiles?: StoredFile[];
	onChange?: () => void;
}

const TEXT_TYPES = ['text/plain', 'application/json'];
const PDF_TYPE = 'application/pdf';

function getKindFromName(name: string): FilePreview['kind'] {
	const lower = name.toLowerCase();
	if (lower.endsWith('.pdf')) return 'pdf';
	if (lower.endsWith('.txt') || lower.endsWith('.json')) return 'text';
	return 'other';
}

function getKind(file: File): FilePreview['kind'] {
	if (file.type === PDF_TYPE || file.name.endsWith('.pdf')) return 'pdf';
	if (
		TEXT_TYPES.includes(file.type) ||
		file.name.endsWith('.txt') ||
		file.name.endsWith('.json')
	)
		return 'text';
	return 'other';
}

function textMimeTypeForName(name: string): string {
	return name.toLowerCase().endsWith('.json') ? 'application/json' : 'text/plain';
}

async function downloadPreview(preview: FilePreview): Promise<void> {
	const link = document.createElement('a');
	link.download = preview.name;

	if (
		preview.kind === 'text' &&
		!preview.content.startsWith('data:') &&
		!preview.content.startsWith('http')
	) {
		const blob = new Blob([preview.content], {
			type: textMimeTypeForName(preview.name),
		});
		const url = URL.createObjectURL(blob);
		link.href = url;
		link.click();
		URL.revokeObjectURL(url);
		return;
	}

	if (preview.content.startsWith('data:')) {
		link.href = preview.content;
		link.click();
		return;
	}

	const response = await fetch(preview.content);
	if (!response.ok) {
		throw new Error(`Failed to download file (${response.status})`);
	}
	const blob = await response.blob();
	const url = URL.createObjectURL(blob);
	link.href = url;
	link.click();
	URL.revokeObjectURL(url);
}

async function loadPreviewFromStoredFile(
	file: StoredFile,
): Promise<FilePreview> {
	const kind = getKindFromName(file.name);

	if (kind === 'text') {
		const response = await fetch(file.url);
		if (!response.ok) {
			throw new Error(`Failed to load file preview (${response.status})`);
		}
		const content = await response.text();
		return {
			name: file.name,
			kind,
			content,
			storageFilename: file.storageFilename,
		};
	}

	return {
		name: file.name,
		kind,
		content: file.url,
		storageFilename: file.storageFilename,
	};
}

const FileUpload = forwardRef<FileUploadHandle, FileUploadProps>(
	({ initialFiles = [], onChange }, ref) => {
		const fileInputRef = useRef<HTMLInputElement>(null);
		const {
			items: previews,
			itemsRef: previewsRef,
			setAll: setPreviews,
			append,
			removeAt,
			getSaveItems,
			commitSavedFilenames,
			reset,
		} = useStorageItemList<FilePreview>();

		useImperativeHandle(
			ref,
			() => ({
				trigger: () => fileInputRef.current?.click(),
				download: async () => {
					for (const preview of previewsRef.current) {
						await downloadPreview(preview);
					}
				},
				getPreviews: () => previewsRef.current,
				getSaveItems,
				commitSavedFilenames,
				reset,
			}),
			[commitSavedFilenames, getSaveItems, previewsRef, reset],
		);

		// Load previews for the stored files whenever the saved list changes.
		useStoredListEffect(initialFiles, (files) => {
			let cancelled = false;

			void Promise.all(files.map((file) => loadPreviewFromStoredFile(file)))
				.then((loaded) => {
					if (!cancelled) setPreviews(loaded);
				})
				.catch((error: unknown) => {
					logErrorDetails(error, 'Load file previews');
					if (cancelled) return;
					setPreviews(
						files.map((file) => ({
							name: file.name,
							kind: 'other' as const,
							content: file.url,
							storageFilename: file.storageFilename,
						})),
					);
				});

			return () => {
				cancelled = true;
			};
		});

		const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
			const files = Array.from(e.target.files ?? []);

			files.forEach((file) => {
				const kind = getKind(file);
				const reader = new FileReader();
				reader.onload = (ev) => {
					append({
						name: file.name,
						kind,
						content: ev.target?.result as string,
						pendingFile: file,
					});
					onChange?.();
				};
				if (kind === 'text') {
					reader.readAsText(file);
				} else {
					reader.readAsDataURL(file);
				}
			});

			e.target.value = '';
		};

		const removePreview = (index: number) => {
			removeAt(index);
			onChange?.();
		};

		return (
			<div style={{ display: 'flex', flexDirection: 'column' }}>
				<input
					ref={fileInputRef}
					type='file'
					accept={FILE_UPLOAD.accept}
					multiple
					hidden
					aria-hidden='true'
					style={{ display: 'none' }}
					onChange={handleFileChange}
				/>
				{previews.length === 0 && (
					<div
						className='upload-placeholder'
						onClick={() => fileInputRef.current?.click()}
					>
						<InsertDriveFileOutlinedIcon sx={{ fontSize: 48 }} />
						<span style={{ fontSize: '0.875rem' }}>Upload files</span>
						<span
							style={{ fontSize: '0.75rem', opacity: 0.75, textAlign: 'center' }}
						>
							{FILE_UPLOAD.hint}
						</span>
					</div>
				)}
				{previews.length > 0 && (
					<div className='file-upload-previews'>
						{previews.map((preview, i) => (
							<div key={i} className='file-upload-item'>
								<div className='file-upload-item-header'>
									<span className='file-upload-item-name'>{preview.name}</span>
									<button
										className='file-upload-remove-btn'
										onClick={() => removePreview(i)}
										aria-label='Remove File'
									>
										<CloseIcon fontSize='small' />
									</button>
								</div>
								{preview.kind === 'pdf' && (
									<PdfPreview
										src={preview.content}
										name={preview.name}
										className='file-upload-iframe'
									/>
								)}
								{preview.kind === 'text' && (
									<pre className='file-upload-text'>{preview.content}</pre>
								)}
								{preview.kind === 'other' && (
									<p className='file-upload-unsupported'>
										Preview not available for this file type.{' '}
										<a href={preview.content} download={preview.name}>
											Download
										</a>
									</p>
								)}
							</div>
						))}
					</div>
				)}
			</div>
		);
	},
);

FileUpload.displayName = 'FileUpload';

export { FileUpload };
export type { FileUploadHandle };
