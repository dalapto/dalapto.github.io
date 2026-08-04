import React from 'react';
import type {
	ImageUploadHandle,
	StoredImage,
} from '../../../components/controls/ImageUpload/ImageUpload';
import { ImageUpload } from '../../../components/controls/ImageUpload/ImageUpload';
import { StandardButton } from '../../../components/controls/StandardButton/StandardButton';
import { ActionsPanel } from '../../../components/layout/ActionsPanel/ActionsPanel';
import { useSaving } from '../../../context/SavingContext';
import { ClipboardContentMeta } from './ClipboardContentMeta';

interface ImageTabPanelProps {
	imageUploadRef: React.RefObject<ImageUploadHandle>;
	initialImages: StoredImage[];
	onImageChange: () => void;
	lastUpdatedImage: Date;
	hasContent: boolean;
	hasNoImageChanges: boolean;
	onClear: () => void;
	onSave: () => void;
	onRefresh: () => void;
}

function ImageTabPanel({
	imageUploadRef,
	initialImages,
	onImageChange,
	lastUpdatedImage,
	hasContent,
	hasNoImageChanges,
	onClear,
	onSave,
	onRefresh,
}: ImageTabPanelProps) {
	const { saving } = useSaving();
	return (
		<ActionsPanel
			onRefresh={onRefresh}
			leadingActions={
				<StandardButton
					variant='contained'
					onClick={() => imageUploadRef.current?.trigger()}
				>
					Upload
				</StandardButton>
			}
			actions={
				<>
					{hasContent && (
						<StandardButton
							variant='outlined'
							disabled={saving}
							onClick={onClear}
						>
							Clear
						</StandardButton>
					)}
					<StandardButton
						variant='contained'
						disabled={hasNoImageChanges || saving}
						onClick={onSave}
					>
						Save
					</StandardButton>
				</>
			}
		>
			<ImageUpload
				ref={imageUploadRef}
				initialImages={initialImages}
				onChange={onImageChange}
			/>
			<ClipboardContentMeta
				lastUpdated={lastUpdatedImage}
				hasContent={hasContent}
			/>
		</ActionsPanel>
	);
}

export { ImageTabPanel };
