import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import React from 'react';
import type {
	ImageUploadHandle,
	StoredImage,
} from '../../../components/controls/ImageUpload/ImageUpload';
import { ImageUpload } from '../../../components/controls/ImageUpload/ImageUpload';
import { useAuthRequest } from '../../../context/AuthRequestContext';
import { useSupabase } from '../../../context/SupabaseContext';
import type { HeaderActions } from '../../../types/basic.types';
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
	const { user } = useSupabase();
	const { requestAuth } = useAuthRequest();

	function handleSave() {
		if (!user) {
			requestAuth();
		}
		void onSave();
	}

	const headerEndActions = [
		{
			id: 'copy',
			label: 'Copy',
			variant: 'outlined' as const,
			icon: <ContentCopyIcon />,
			onClick: () => void imageUploadRef.current?.copyToClipboard(),
			disabled: !hasContent,
		},
		{
			id: 'paste',
			label: 'Paste',
			variant: 'contained' as const,
			icon: <ContentPasteIcon />,
			onClick: () => void imageUploadRef.current?.pasteFromClipboard(),
			mobileIconOnly: false,
		},
	];

	const footerActions: HeaderActions = {
		end: [
			{
				id: 'clear',
				label: 'Clear',
				variant: 'outlined',
				onClick: onClear,
				hidden: !hasContent,
			},
			{
				id: 'save',
				label: 'Save',
				variant: 'contained',
				onClick: handleSave,
				disabled: user ? hasNoImageChanges : !hasContent,
			},
		],
	};

	return (
		<ClipboardTabPanel
			onRefresh={onRefresh}
			onClear={onClear}
			onSave={onSave}
			hasContent={hasContent}
			hasNoChanges={hasNoImageChanges}
			lastUpdated={lastUpdatedImage}
			onUpload={() => imageUploadRef.current?.trigger()}
			headerEndActions={headerEndActions}
			footerActions={footerActions}
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
