import CloseIcon from '@mui/icons-material/Close';
import PermMediaOutlinedIcon from '@mui/icons-material/PermMediaOutlined';
import {
	forwardRef,
	useCallback,
	useEffect,
	useImperativeHandle,
	useRef,
	useState,
} from 'react';
import {
	getMediaKindFromFile,
	getMediaKindFromName,
	MEDIA_UPLOAD,
	type MediaKind,
} from '../../../constants/upload-types';
import { ToastSeverity, useToast } from '../../../context/ToastProvider';
import {
	useStorageItemList,
	useStoredListEffect,
} from '../../../hooks/useStorageItemList';
import type { Image } from '../../../types/basic.types';
import type { StorageSaveItem, StoredMedia } from '../../../types/upload.types';
import {
	getImageFilesFromDataTransfer,
	imageSourceToPngBlob,
	readImagesFromClipboard,
	writePngToClipboard,
} from '../../../utils/clipboard-image-helpers';
import { ImageCycler } from '../../display/ImageCycler/ImageCycler';
import { Lightbox } from '../../display/Lightbox/Lightbox';
import { AudioPlayer } from '../../display/MediaPlayer/AudioPlayer';
import { VideoPlayer } from '../../display/MediaPlayer/VideoPlayer';
import './MediaUpload.css';

type MediaPreviewItem = {
	kind: MediaKind;
	/** data: URL (picked image), blob: URL (picked audio/video) or storage URL. */
	src: string;
	name: string;
	storageFilename?: string;
	pendingFile?: File;
};

interface MediaUploadProps {
	initialMedia?: StoredMedia[];
	onChange?: () => void;
	/**
	 * Fetches a stored image by its storage filename (used when copying a saved
	 * image to the clipboard). Keeps this control independent of any backend.
	 */
	loadStoredImage?: (storageFilename: string) => Promise<Blob | null>;
}

interface MediaUploadHandle {
	trigger: () => void;
	addFiles: (files: File[]) => void;
	copyToClipboard: () => Promise<void>;
	pasteFromClipboard: () => Promise<void>;
	getPreviews: () => string[];
	getSaveItems: () => StorageSaveItem[];
	commitSavedFilenames: (filenames: string[]) => void;
	reset: () => void;
}

const MediaUpload = forwardRef<MediaUploadHandle, MediaUploadProps>(
	({ initialMedia = [], onChange, loadStoredImage }, ref) => {
		const { showToast } = useToast();
		const containerRef = useRef<HTMLDivElement>(null);
		const fileInputRef = useRef<HTMLInputElement>(null);
		/** blob: URLs created for picked audio/video, revoked once unused. */
		const objectUrlsRef = useRef(new Set<string>());
		const {
			items,
			itemsRef,
			setAll: setItems,
			append,
			removeAt,
			getSaveItems,
			commitSavedFilenames,
			reset,
		} = useStorageItemList<MediaPreviewItem>();
		const [lightboxOpen, setLightboxOpen] = useState(false);
		const [lightboxIndex, setLightboxIndex] = useState(0);
		const [isDragOver, setIsDragOver] = useState(false);

		// Free blob: URLs whose item has gone (removed, cleared or replaced).
		useEffect(() => {
			const inUse = new Set(items.map((item) => item.src));
			for (const url of objectUrlsRef.current) {
				if (!inUse.has(url)) {
					URL.revokeObjectURL(url);
					objectUrlsRef.current.delete(url);
				}
			}
		}, [items]);

		useEffect(() => {
			const urls = objectUrlsRef.current;
			return () => {
				urls.forEach((url) => URL.revokeObjectURL(url));
				urls.clear();
			};
		}, []);

		const addMediaFiles = useCallback(
			(files: File[]) => {
				let invalidCount = 0;

				for (const file of files) {
					const kind = getMediaKindFromFile(file);
					if (!kind) {
						invalidCount += 1;
						continue;
					}

					if (kind === 'image') {
						const reader = new FileReader();
						reader.onload = (ev) => {
							append({
								kind,
								src: ev.target?.result as string,
								name: file.name,
								pendingFile: file,
							});
							onChange?.();
						};
						reader.readAsDataURL(file);
					} else {
						// Audio/video can be large: play straight from the file.
						const url = URL.createObjectURL(file);
						objectUrlsRef.current.add(url);
						append({ kind, src: url, name: file.name, pendingFile: file });
						onChange?.();
					}
				}

				if (invalidCount > 0) {
					showToast(
						'Only image, audio or video files can be added.',
						ToastSeverity.WARNING,
					);
				}
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

				addMediaFiles(files);
			} catch {
				showToast('Could not read image from clipboard.', ToastSeverity.WARNING);
			}
		}, [addMediaFiles, showToast]);

		const copyToClipboard = useCallback(async () => {
			const images = itemsRef.current.filter((item) => item.kind === 'image');
			if (images.length === 0) {
				showToast('No image to copy.', ToastSeverity.WARNING);
				return;
			}

			const lastAdded = images[images.length - 1];

			try {
				const pngBlob = await imageSourceToPngBlob(lastAdded, loadStoredImage);
				await writePngToClipboard(pngBlob);
				if (images.length > 1) {
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
				addFiles: addMediaFiles,
				copyToClipboard,
				pasteFromClipboard,
				getPreviews: () => itemsRef.current.map((item) => item.src),
				getSaveItems,
				commitSavedFilenames,
				reset,
			}),
			[
				addMediaFiles,
				commitSavedFilenames,
				copyToClipboard,
				getSaveItems,
				itemsRef,
				pasteFromClipboard,
				reset,
			],
		);

		// Show the stored media whenever the saved list changes.
		useStoredListEffect(initialMedia, (media) => {
			setItems(
				media.map((item) => ({
					kind: getMediaKindFromName(item.storageFilename),
					src: item.url,
					name: item.name,
					storageFilename: item.storageFilename,
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
				addMediaFiles(files);
			}

			document.addEventListener('paste', onPaste);
			return () => document.removeEventListener('paste', onPaste);
		}, [addMediaFiles]);

		// The lightbox only cycles through images.
		const imageItems = items.filter((item) => item.kind === 'image');
		const lightboxImages: Image[] = imageItems.map((item) => ({
			src: item.src,
			alt: item.name,
		}));

		const openLightbox = (item: MediaPreviewItem) => {
			setLightboxIndex(Math.max(0, imageItems.indexOf(item)));
			setLightboxOpen(true);
		};

		const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
			addMediaFiles(Array.from(e.target.files ?? []));
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
			addMediaFiles(Array.from(e.dataTransfer.files));
		};

		const dropzoneClassName = [
			'media-upload-dropzone',
			isDragOver ? 'media-upload-dropzone--drag-over' : '',
			items.length > 0 ? 'media-upload-dropzone--has-previews' : '',
		]
			.filter(Boolean)
			.join(' ');

		const renderRemoveButton = (index: number, name: string) =>
			!lightboxOpen && (
				<button
					type='button'
					className='media-upload-remove-btn'
					onClick={(e) => {
						e.stopPropagation();
						removePreview(index);
					}}
					aria-label={`Remove ${name}`}
				>
					<CloseIcon fontSize='small' />
				</button>
			);

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
					accept={MEDIA_UPLOAD.accept}
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
						aria-label={`Upload, drag and drop, or paste media. Accepted: ${MEDIA_UPLOAD.hint}`}
						onClick={() => fileInputRef.current?.click()}
						onKeyDown={(e) => {
							if (e.key === 'Enter' || e.key === ' ') {
								e.preventDefault();
								fileInputRef.current?.click();
							}
						}}
					>
						<PermMediaOutlinedIcon sx={{ fontSize: 48 }} />
						<span style={{ fontSize: '0.875rem' }}>
							Upload, drag &amp; drop, or paste media
						</span>
						<span
							style={{ fontSize: '0.75rem', opacity: 0.75, textAlign: 'center' }}
						>
							{MEDIA_UPLOAD.hint}
						</span>
					</div>
				)}
				{items.length > 0 && (
					<div className='media-upload-previews'>
						{items.map((item, i) => {
							if (item.kind === 'audio') {
								return (
									<div key={i} className='media-upload-audio'>
										<div className='media-upload-audio-header'>
											<span className='media-upload-audio-name'>
												{item.name}
											</span>
											{renderRemoveButton(i, item.name)}
										</div>
										<AudioPlayer src={item.src} title={item.name} />
									</div>
								);
							}

							if (item.kind === 'video') {
								return (
									<div key={i} className='media-upload-tile'>
										<VideoPlayer src={item.src} title={item.name} />
										{renderRemoveButton(i, item.name)}
									</div>
								);
							}

							return (
								<div key={i} className='media-upload-tile'>
									<img
										src={item.src}
										alt={item.name}
										onClick={() => openLightbox(item)}
									/>
									{renderRemoveButton(i, item.name)}
								</div>
							);
						})}
					</div>
				)}
				<Lightbox open={lightboxOpen} onClose={() => setLightboxOpen(false)}>
					{lightboxOpen && (
						<ImageCycler
							key={lightboxIndex}
							images={lightboxImages}
							interval={0}
							objectFit='contain'
							minHeight='75vh'
							initialIndex={lightboxIndex}
							showDots={lightboxImages.length > 1}
							showArrows={lightboxImages.length > 1}
						/>
					)}
				</Lightbox>
			</div>
		);
	},
);

MediaUpload.displayName = 'MediaUpload';

export { MediaUpload };
export type { MediaUploadHandle };
