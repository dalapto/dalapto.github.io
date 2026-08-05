import CloseIcon from '@mui/icons-material/Close';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import React, {
	forwardRef,
	useEffect,
	useImperativeHandle,
	useRef,
	useState,
} from 'react';
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
	getPreviews: () => string[];
	getSaveItems: () => StorageSaveItem[];
	commitSavedFilenames: (filenames: string[]) => void;
	reset: () => void;
}

const ImageUpload = forwardRef<ImageUploadHandle, ImageUploadProps>(
	({ initialImages = [], onChange }, ref) => {
		const fileInputRef = useRef<HTMLInputElement>(null);
		const itemsRef = useRef<ImagePreviewItem[]>([]);
		const [items, setItems] = useState<ImagePreviewItem[]>([]);
		const [lightboxOpen, setLightboxOpen] = useState(false);
		const [lightboxIndex, setLightboxIndex] = useState(0);

		useImperativeHandle(ref, () => ({
			trigger: () => fileInputRef.current?.click(),
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
		}));

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

		const previewImages: Image[] = items.map((item, i) => ({
			src: item.src,
			alt: `preview-${i}`,
		}));

		const openLightbox = (index: number) => {
			setLightboxIndex(index);
			setLightboxOpen(true);
		};

		const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
			const files = Array.from(e.target.files ?? []);

			files.forEach((file) => {
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

			e.target.value = '';
		};

		const removePreview = (index: number) => {
			const next = itemsRef.current.filter((_, i) => i !== index);
			itemsRef.current = next;
			setItems(next);
			onChange?.();
		};

		return (
			<div style={{ display: 'flex', flexDirection: 'column' }}>
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
						onClick={() => fileInputRef.current?.click()}
					>
						<ImageOutlinedIcon sx={{ fontSize: 48 }} />
						<span style={{ fontSize: '0.875rem' }}>Upload an image</span>
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
