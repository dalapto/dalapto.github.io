import CloseIcon from '@mui/icons-material/Close';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import React, {
	forwardRef,
	useCallback,
	useEffect,
	useImperativeHandle,
	useRef,
	useState,
} from 'react';
import { ToastSeverity, useToast } from '../../../context/ToastProvider';
import type { Image } from '../../../types/basic.types';
import { ImageCycler } from '../../display/ImageCycler/ImageCycler';
import { Lightbox } from '../../display/Lightbox/Lightbox';
import './ImageUpload.css';
import type { StorageSaveItem } from '../../../supabase/supabase-utils';

type ImagePreviewItem = {
	src: string;
	storageFilename?: string;
	pendingFile?: File;
};

interface StoredImage {
	url: string;
	storageFilename: string;
}

interface ImageUploadProps {
	initialImages?: StoredImage[];
	onChange?: () => void;
}

interface ImageUploadHandle {
	trigger: () => void;
	addFiles: (files: File[]) => void;
	pasteFromClipboard: () => Promise<void>;
	getPreviews: () => string[];
	getSaveItems: () => StorageSaveItem[];
	commitSavedFilenames: (filenames: string[]) => void;
	reset: () => void;
}

function isImageFile(file: File): boolean {
	return file.type.startsWith('image/');
}

function getImageFilesFromDataTransfer(data: DataTransfer | null): File[] {
	if (!data) {
		return [];
	}

	const fromFiles = Array.from(data.files).filter(isImageFile);
	if (fromFiles.length > 0) {
		return fromFiles;
	}

	return Array.from(data.items)
		.filter((item) => item.kind === 'file' && item.type.startsWith('image/'))
		.map((item) => item.getAsFile())
		.filter((file): file is File => file !== null);
}

const ImageUpload = forwardRef<ImageUploadHandle, ImageUploadProps>(
	({ initialImages = [], onChange }, ref) => {
		const { showToast } = useToast();
		const containerRef = useRef<HTMLDivElement>(null);
		const fileInputRef = useRef<HTMLInputElement>(null);
		const itemsRef = useRef<ImagePreviewItem[]>([]);
		const [items, setItems] = useState<ImagePreviewItem[]>([]);
		const [lightboxOpen, setLightboxOpen] = useState(false);
		const [lightboxIndex, setLightboxIndex] = useState(0);
		const [isDragOver, setIsDragOver] = useState(false);

		const addImageFiles = useCallback(
			(files: File[]) => {
				const validFiles: File[] = [];
				let invalidCount = 0;

				for (const file of files) {
					if (isImageFile(file)) {
						validFiles.push(file);
					} else {
						invalidCount += 1;
					}
				}

				if (invalidCount > 0) {
					showToast('Only image files can be added.', ToastSeverity.WARNING);
				}

				validFiles.forEach((file) => {
					const reader = new FileReader();
					reader.onload = (ev) => {
						const nextItem: ImagePreviewItem = {
							src: ev.target?.result as string,
							pendingFile: file,
						};
						itemsRef.current = [...itemsRef.current, nextItem];
						setItems([...itemsRef.current]);
						onChange?.();
					};
					reader.readAsDataURL(file);
				});
			},
			[onChange, showToast],
		);

		const pasteFromClipboard = useCallback(async () => {
			try {
				const clipboardItems = await navigator.clipboard.read();
				const files: File[] = [];

				for (const item of clipboardItems) {
					for (const type of item.types) {
						if (!type.startsWith('image/')) {
							continue;
						}

						const blob = await item.getType(type);
						const extension = type.split('/')[1] ?? 'png';
						files.push(
							new File([blob], `pasted-image.${extension}`, { type }),
						);
					}
				}

				if (files.length === 0) {
					showToast('No image found on clipboard.', ToastSeverity.WARNING);
					return;
				}

				addImageFiles(files);
			} catch {
				showToast('Could not read image from clipboard.', ToastSeverity.WARNING);
			}
		}, [addImageFiles, showToast]);

		useImperativeHandle(
			ref,
			() => ({
				trigger: () => fileInputRef.current?.click(),
				addFiles: addImageFiles,
				pasteFromClipboard,
				getPreviews: () => itemsRef.current.map((item) => item.src),
				getSaveItems: () =>
					itemsRef.current.map((item) => ({
						storageFilename: item.storageFilename,
						pendingFile: item.pendingFile,
					})),
				commitSavedFilenames: (filenames: string[]) => {
					const next = itemsRef.current.map((item, index) => ({
						...item,
						storageFilename: filenames[index] ?? item.storageFilename,
						pendingFile: undefined,
					}));
					itemsRef.current = next;
					setItems(next);
				},
				reset: () => {
					itemsRef.current = [];
					setItems([]);
				},
			}),
			[addImageFiles, pasteFromClipboard],
		);

		const initialKey = initialImages
			.map((image) => image.storageFilename)
			.join(',');

		useEffect(() => {
			if (initialImages.length === 0) {
				return;
			}

			const next = initialImages.map((image) => ({
				src: image.url,
				storageFilename: image.storageFilename,
			}));
			itemsRef.current = next;
			setItems(next);
		}, [initialKey]);

		useEffect(() => {
			function onPaste(e: ClipboardEvent) {
				const root = containerRef.current;
				if (!root || root.offsetParent === null) {
					return;
				}

				const files = getImageFilesFromDataTransfer(e.clipboardData);
				if (files.length === 0) {
					return;
				}

				e.preventDefault();
				addImageFiles(files);
			}

			document.addEventListener('paste', onPaste);
			return () => document.removeEventListener('paste', onPaste);
		}, [addImageFiles]);

		const previewImages: Image[] = items.map((item, i) => ({
			src: item.src,
			alt: `preview-${i}`,
		}));

		const openLightbox = (index: number) => {
			setLightboxIndex(index);
			setLightboxOpen(true);
		};

		const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
			addImageFiles(Array.from(e.target.files ?? []));
			e.target.value = '';
		};

		const removePreview = (index: number) => {
			const next = itemsRef.current.filter((_, i) => i !== index);
			itemsRef.current = next;
			setItems(next);
			onChange?.();
		};

		const handleDragOver = (e: React.DragEvent) => {
			e.preventDefault();
			e.dataTransfer.dropEffect = 'copy';
			setIsDragOver(true);
		};

		const handleDragLeave = (e: React.DragEvent) => {
			if (!e.currentTarget.contains(e.relatedTarget as Node)) {
				setIsDragOver(false);
			}
		};

		const handleDrop = (e: React.DragEvent) => {
			e.preventDefault();
			setIsDragOver(false);
			addImageFiles(Array.from(e.dataTransfer.files));
		};

		const dropzoneClassName = [
			'image-upload-dropzone',
			isDragOver ? 'image-upload-dropzone--drag-over' : '',
			items.length > 0 ? 'image-upload-dropzone--has-previews' : '',
		]
			.filter(Boolean)
			.join(' ');

		return (
			<div
				ref={containerRef}
				className={dropzoneClassName}
				onDragOver={handleDragOver}
				onDragLeave={handleDragLeave}
				onDrop={handleDrop}
			>
				<input
					ref={fileInputRef}
					type='file'
					accept='image/*'
					multiple
					hidden
					aria-hidden='true'
					style={{ display: 'none' }}
					onChange={handleFileChange}
				/>
				{items.length === 0 && (
					<div
						className='upload-placeholder'
						tabIndex={0}
						role='button'
						aria-label='Upload, drag and drop, or paste an image'
						onClick={() => fileInputRef.current?.click()}
						onKeyDown={(e) => {
							if (e.key === 'Enter' || e.key === ' ') {
								e.preventDefault();
								fileInputRef.current?.click();
							}
						}}
					>
						<ImageOutlinedIcon sx={{ fontSize: 48 }} />
						<span style={{ fontSize: '0.875rem' }}>
							Upload, drag &amp; drop, or paste an image
						</span>
					</div>
				)}
				{items.length > 0 && (
					<div className='image-upload-previews'>
						{items.map((item, i) => (
							<div key={i} className='image-upload-preview'>
								<img
									src={item.src}
									alt={`preview-${i}`}
									onClick={() => openLightbox(i)}
								/>
								{!lightboxOpen && (
									<button
										onClick={(e) => {
											e.stopPropagation();
											removePreview(i);
										}}
										className='remove-btn'
										style={{
											position: 'absolute',
											top: 4,
											right: 4,
											background: 'rgba(0,0,0,0.5)',
											border: 'none',
											borderRadius: '50%',
											cursor: 'pointer',
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
											padding: 2,
											color: 'white',
										}}
										aria-label='Remove Image'
									>
										<CloseIcon fontSize='small' />
									</button>
								)}
							</div>
						))}
					</div>
				)}
				<Lightbox open={lightboxOpen} onClose={() => setLightboxOpen(false)}>
					{lightboxOpen && (
						<ImageCycler
							key={lightboxIndex}
							images={previewImages}
							interval={0}
							objectFit='contain'
							minHeight='75vh'
							initialIndex={lightboxIndex}
							showDots={previewImages.length > 1}
							showArrows={previewImages.length > 1}
						/>
					)}
				</Lightbox>
			</div>
		);
	},
);

ImageUpload.displayName = 'ImageUpload';

export { ImageUpload };
export type { ImageUploadHandle, StoredImage };
