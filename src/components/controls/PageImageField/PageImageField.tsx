import DeleteIcon from '@mui/icons-material/Delete';
import UploadIcon from '@mui/icons-material/Upload';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Box } from '@mui/material';
import React, { useRef, useState } from 'react';
import type { Image } from '../../../types/basic.types';
import { ImageCycler } from '../../display/ImageCycler/ImageCycler';
import { Lightbox } from '../../display/Lightbox/Lightbox';
import { ActionButton } from '../ActionButton/ActionButton';

interface PageImageFieldProps {
	imageUrl: string | null;
	onFileSelect: (file: File) => void;
	onRemove: () => void;
	disabled?: boolean;
}

function PageImageField({
	imageUrl,
	onFileSelect,
	onRemove,
	disabled = false,
}: PageImageFieldProps) {
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [previewOpen, setPreviewOpen] = useState(false);

	const previewImages: Image[] = imageUrl
		? [{ src: imageUrl, alt: 'Page preview' }]
		: [];

	function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
		const file = e.target.files?.[0];
		e.target.value = '';
		if (file) onFileSelect(file);
	}

	function openFilePicker() {
		fileInputRef.current?.click();
	}

	function handleRemove() {
		setPreviewOpen(false);
		onRemove();
	}

	return (
		<>
			<Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, minWidth: 0 }}>
				<input
					ref={fileInputRef}
					type='file'
					accept='image/*'
					hidden
					aria-hidden='true'
					disabled={disabled}
					onChange={handleFileChange}
				/>
				<Box
					sx={{
						display: 'flex',
						alignItems: 'center',
						gap: 1,
						flexWrap: 'wrap',
					}}
				>
					<ActionButton
						label={!imageUrl ? 'Upload Image' : 'Replace Image'}
						variant='outlined'
						icon={<UploadIcon />}
						onClick={openFilePicker}
						disabled={disabled}
						mobileIconOnly={false}
					/>
					{imageUrl && (
						<>
							<ActionButton
								label='Preview'
								variant='outlined'
								icon={<VisibilityIcon />}
								onClick={() => setPreviewOpen(true)}
								disabled={disabled}
								mobileIconOnly={true}
							/>
							<ActionButton
								label='Remove'
								variant='outlined'
								icon={<DeleteIcon />}
								onClick={handleRemove}
								mobileIconOnly={true}
								disabled={disabled}
								color='danger'
							/>
						</>
					)}
				</Box>
			</Box>

			<Lightbox open={previewOpen} onClose={() => setPreviewOpen(false)}>
				{previewOpen && (
					<ImageCycler
						images={previewImages}
						interval={0}
						objectFit='contain'
						minHeight='75vh'
						showDots={false}
						showArrows={false}
					/>
				)}
			</Lightbox>
		</>
	);
}

export { PageImageField };
export type { PageImageFieldProps };
