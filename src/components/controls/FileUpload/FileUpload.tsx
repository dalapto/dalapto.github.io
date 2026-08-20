import CloseIcon from '@mui/icons-material/Close';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import React, {
	forwardRef,
	useEffect,
	useImperativeHandle,
	useRef,
	useState,
} from 'react';
import './FileUpload.css';
import type { StorageSaveItem } from '../../../supabase/supabase-utils';

type FilePreview = {
	name: string;
	kind: 'pdf' | 'text' | 'other';
	content: string;
	storageFilename?: string;
	pendingFile?: File;
};

interface StoredFile {
	url: string;
	name: string;
	storageFilename: string;
}

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
		const previewsRef = useRef<FilePreview[]>([]);
		const [previews, setPreviews] = useState<FilePreview[]>([]);

		useImperativeHandle(ref, () => ({
			trigger: () => fileInputRef.current?.click(),
			download: async () => {
				for (const preview of previewsRef.current) {
					await downloadPreview(preview);
				}
			},
			getPreviews: () => previewsRef.current,
			getSaveItems: () =>
				previewsRef.current.map((preview) => ({
					storageFilename: preview.storageFilename,
					pendingFile: preview.pendingFile,
				})),
			commitSavedFilenames: (filenames: string[]) => {
				const next = previewsRef.current.map((preview, index) => ({
					...preview,
					storageFilename: filenames[index] ?? preview.storageFilename,
					pendingFile: undefined,
				}));
				previewsRef.current = next;
				setPreviews(next);
			},
			reset: () => {
				previewsRef.current = [];
				setPreviews([]);
			},
		}));

		const initialKey = initialFiles
			.map((file) => file.storageFilename)
			.join(',');

		useEffect(() => {
			if (initialFiles.length === 0) {
				return;
			}

			let cancelled = false;

			void Promise.all(initialFiles.map((file) => loadPreviewFromStoredFile(file)))
				.then((loaded) => {
					if (cancelled) return;
					previewsRef.current = loaded;
					setPreviews(loaded);
				})
				.catch(() => {
					if (cancelled) return;
					const fallback = initialFiles.map((file) => ({
						name: file.name,
						kind: 'other' as const,
						content: file.url,
						storageFilename: file.storageFilename,
					}));
					previewsRef.current = fallback;
					setPreviews(fallback);
				});

			return () => {
				cancelled = true;
			};
		}, [initialKey]);

		const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
			const files = Array.from(e.target.files ?? []);

			files.forEach((file) => {
				const kind = getKind(file);
				const reader = new FileReader();
				reader.onload = (ev) => {
					const nextPreview: FilePreview = {
						name: file.name,
						kind,
						content: ev.target?.result as string,
						pendingFile: file,
					};
					previewsRef.current = [...previewsRef.current, nextPreview];
					setPreviews([...previewsRef.current]);
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
			const nextPreviews = previewsRef.current.filter((_, i) => i !== index);
			previewsRef.current = nextPreviews;
			setPreviews(nextPreviews);
			onChange?.();
		};

		return (
			<div style={{ display: 'flex', flexDirection: 'column' }}>
				<input
					ref={fileInputRef}
					type='file'
					accept='.pdf,.doc,.docx,.txt,.json,application/pdf,text/plain,application/json'
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
									<iframe
										src={preview.content}
										title={preview.name}
										className='file-upload-iframe'
										allowFullScreen={true}
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
export type { FileUploadHandle, StoredFile };
