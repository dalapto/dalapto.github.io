import CloseIcon from '@mui/icons-material/Close';
import React, { useRef, useState } from 'react';
import { ImageCycler } from '../../display/ImageCycler/ImageCycler';
import { Lightbox } from '../../display/Lightbox/Lightbox';
import type { Image } from '../../../types/basic.types';
import './ImageUpload.css';

function ImageUpload() {
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [previews, setPreviews] = useState<string[]>([]);
	const [lightboxOpen, setLightboxOpen] = useState(false);
	const [lightboxIndex, setLightboxIndex] = useState(0);

	const previewImages: Image[] = previews.map((src, i) => ({
		src,
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
				setPreviews((prev) => [...prev, ev.target?.result as string]);
			};
			reader.readAsDataURL(file);
		});
		e.target.value = '';
	};

	const removePreview = (index: number) => {
		setPreviews((prev) => prev.filter((_, i) => i !== index));
	};

	return (
		<div>
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
			<button onClick={() => fileInputRef.current?.click()}>
				Upload Image(s)
			</button>
			{previews.length > 0 && (
				<div className='image-upload-previews'>
					{previews.map((src, i) => (
						<div key={i} className='image-upload-preview'>
							<img
								src={src}
								alt={`preview-${i}`}
								onClick={() => openLightbox(i)}
							/>
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
}

export { ImageUpload };
