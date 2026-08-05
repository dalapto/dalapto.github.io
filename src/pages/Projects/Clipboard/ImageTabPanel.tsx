import React from 'react';
import type {
	ImageUploadHandle,
	StoredImage,
} from '../../../components/controls/ImageUpload/ImageUpload';
import { ImageUpload } from '../../../components/controls/ImageUpload/ImageUpload';
import { ActionsPanel } from '../../../components/layout/ActionsPanel/ActionsPanel';
import {
	ClipboardTabActions,
	ClipboardUploadButton,
} from './ClipboardButtons';
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
	return (
		<ActionsPanel
			onRefresh={onRefresh}
			leadingActions={
				<ClipboardUploadButton
					onClick={() => imageUploadRef.current?.trigger()}
				/>
			}
			actions={
				<ClipboardTabActions
					hasContent={hasContent}
					hasNoChanges={hasNoImageChanges}
					onClear={onClear}
					onSave={onSave}
				/>
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
