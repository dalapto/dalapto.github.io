import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import React from 'react';
import type { MediaUploadHandle } from '../../../components/controls/MediaUpload/MediaUpload';
import { MediaUpload } from '../../../components/controls/MediaUpload/MediaUpload';
import { useSupabase } from '../../../context/SupabaseContext';
import { downloadClipboardImage } from '../../../services/clipboard.service';
import type { HeaderActions } from '../../../types/basic.types';
import type { StoredMedia } from '../../../types/upload.types';
import { ClipboardTabPanel } from './ClipboardTabPanel';

interface MediaTabPanelProps {
	mediaUploadRef: React.RefObject<MediaUploadHandle>;
	initialMedia: StoredMedia[];
	onMediaChange: () => void;
	lastUpdatedMedia: Date;
	hasContent: boolean;
	hasNoMediaChanges: boolean;
	onClear: () => void;
	onSave: () => void;
	onRefresh: () => void;
}

function MediaTabPanel({
	mediaUploadRef,
	initialMedia,
	onMediaChange,
	lastUpdatedMedia,
	hasContent,
	hasNoMediaChanges,
	onClear,
	onSave,
	onRefresh,
}: MediaTabPanelProps) {
	const { user } = useSupabase();

	// onSave() asks for sign-in itself when needed (and resumes the save after).
	function handleSave() {
		void onSave();
	}

	const headerEndActions = [
		{
			id: 'copy',
			label: 'Copy',
			variant: 'outlined' as const,
			icon: <ContentCopyIcon />,
			onClick: () => void mediaUploadRef.current?.copyToClipboard(),
			disabled: !hasContent,
		},
		{
			id: 'paste',
			label: 'Paste',
			variant: 'contained' as const,
			icon: <ContentPasteIcon />,
			onClick: () => void mediaUploadRef.current?.pasteFromClipboard(),
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
				disabled: user ? hasNoMediaChanges : !hasContent,
			},
		],
	};

	return (
		<ClipboardTabPanel
			onRefresh={onRefresh}
			onClear={onClear}
			onSave={onSave}
			hasContent={hasContent}
			hasNoChanges={hasNoMediaChanges}
			lastUpdated={lastUpdatedMedia}
			onUpload={() => mediaUploadRef.current?.trigger()}
			headerEndActions={headerEndActions}
			footerActions={footerActions}
		>
			<MediaUpload
				ref={mediaUploadRef}
				initialMedia={initialMedia}
				onChange={onMediaChange}
				loadStoredImage={downloadClipboardImage}
			/>
		</ClipboardTabPanel>
	);
}

export { MediaTabPanel };
