import React from 'react';
import type {
	ImageUploadHandle,
	StoredImage,
} from '../../../components/controls/ImageUpload/ImageUpload';
import { ImageUpload } from '../../../components/controls/ImageUpload/ImageUpload';
import { ClipboardTabPanel } from './ClipboardTabPanel';

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
	return (
		<ClipboardTabPanel
			onRefresh={onRefresh}
			onClear={onClear}
			onSave={onSave}
			hasContent={hasContent}
			hasNoChanges={hasNoImageChanges}
			lastUpdated={lastUpdatedImage}
			onUpload={() => imageUploadRef.current?.trigger()}
			onPaste={() => void imageUploadRef.current?.pasteFromClipboard()}
		>
			<ImageUpload
				ref={imageUploadRef}
				initialImages={initialImages}
				onChange={onImageChange}
			/>
		</ClipboardTabPanel>
	);
}

export { ImageTabPanel };
