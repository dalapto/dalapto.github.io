import CloseIcon from '@mui/icons-material/Close';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import {
	forwardRef,
	useCallback,
	useEffect,
	useImperativeHandle,
	useRef,
	useState,
} from 'react';
import { IMAGE_UPLOAD } from '../../../constants/upload-types';
import { ToastSeverity, useToast } from '../../../context/ToastProvider';
import {
	useStorageItemList,
	useStoredListEffect,
} from '../../../hooks/useStorageItemList';
import type { Image } from '../../../types/basic.types';
import { ImageCycler } from '../../display/ImageCycler/ImageCycler';
import { Lightbox } from '../../display/Lightbox/Lightbox';
import './ImageUpload.css';
import type { StorageSaveItem, StoredImage } from '../../../types/upload.types';
import {
	getImageFilesFromDataTransfer,
	imageSourceToPngBlob,
	readImagesFromClipboard,
	writePngToClipboard,
} from '../../../utils/clipboard-image-helpers';

type ImagePreviewItem = {
	src: string;
	storageFilename?: string;
	pendingFile?: File;
};

interface ImageUploadProps {
	initialImages?: StoredImage[];
	onChange?: () => void;
	/**
	 * Fetches a stored image by its storage filename (used when copying a saved
	 * image to the clipboard). Keeps this control independent of any backend.
	 */
	loadStoredImage?: (storageFilename: string) => Promise<Blob | null>;
}

interface ImageUploadHandle {
	trigger: () => void;
	addFiles: (files: File[]) => void;
	copyToClipboard: () => Promise<void>;
	pasteFromClipboard: () => Promise<void>;
	getPreviews: () => string[];
	getSaveItems: () => StorageSaveItem[];
	commitSavedFilenames: (filenames: string[]) => void;
	reset: () => void;
}

function isImageFile(file: File): boolean {
	return file.type.startsWith('image/');
}

const ImageUpload = forwardRef<ImageUploadHandle, ImageUploadProps>(
	({ initialImages = [], onChange, loadStoredImage }, ref) => {
		const { showToast } = useToast();
		const containerRef = useRef<HTMLDivElement>(null);
		const fileInputRef = useRef<HTMLInputElement>(null);
		const {
			items,
			itemsRef,
			setAll: setItems,
			append,
			removeAt,
			getSaveItems,
			commitSavedFilenames,
			reset,
		} = useStorageItemList<ImagePreviewItem>();
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
						append({ src: ev.target?.result as string, pendingFile: file });
						onChange?.();
					};
					reader.readAsDataURL(file);
				});
			},
			[append, onChange, showToast],
		);

		const pasteFromClipboard = useCallback(async () => {
			try {
				const files = await readImagesFromClipboard();

				if (files.length === 0) {
					showToast('No image found on clipboard.', ToastSeverity.WARNING);
					return;
				}

				addImageFiles(files);
			} catch {
				showToast('Could not read image from clipboard.', ToastSeverity.WARNING);
			}
		}, [addImageFiles, showToast]);

		const copyToClipboard = useCallback(async () => {
			const currentItems = itemsRef.current;
			if (currentItems.length === 0) {
				showToast('No image to copy.', ToastSeverity.WARNING);
				return;
			}

			const lastAdded = currentItems[currentItems.length - 1];

			try {
				const pngBlob = await imageSourceToPngBlob(lastAdded, loadStoredImage);
				await writePngToClipboard(pngBlob);
				if (currentItems.length > 1) {
					showToast(
						'Only the most recently added image was copied.',
						ToastSeverity.INFO,
					);
				}
			} catch {
				showToast('Could not copy image to clipboard.', ToastSeverity.WARNING);
			}
		}, [itemsRef, showToast, loadStoredImage]);

		useImperativeHandle(
			ref,
			() => ({
				trigger: () => fileInputRef.current?.click(),
				addFiles: addImageFiles,
				copyToClipboard,
				pasteFromClipboard,
				getPreviews: () => itemsRef.current.map((item) => item.src),
				getSaveItems,
				commitSavedFilenames,
				reset,
			}),
			[
				addImageFiles,
				commitSavedFilenames,
				copyToClipboard,
				getSaveItems,
				itemsRef,
				pasteFromClipboard,
				reset,
			],
		);

		// Show the stored images whenever the saved list changes.
		useStoredListEffect(initialImages, (images) => {
			setItems(
				images.map((image) => ({
					src: image.url,
					storageFilename: image.storageFilename,
				})),
			);
		});

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
			removeAt(index);
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
					accept={IMAGE_UPLOAD.accept}
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
						aria-label={`Upload, drag and drop, or paste an image. Accepted: ${IMAGE_UPLOAD.hint}`}
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
						<span
							style={{ fontSize: '0.75rem', opacity: 0.75, textAlign: 'center' }}
						>
							{IMAGE_UPLOAD.hint}
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
export type { ImageUploadHandle };
