import DownloadIcon from '@mui/icons-material/Download';
import React from 'react';
import type { FileUploadHandle } from '../../../components/controls/FileUpload/FileUpload';
import type { StoredFile } from '../../../types/upload.types';
import { FileUpload } from '../../../components/controls/FileUpload/FileUpload';
import { useSupabase } from '../../../context/SupabaseContext';
import { ToastSeverity, useToast } from '../../../context/ToastProvider';
import type { HeaderActions } from '../../../types/basic.types';
import { ClipboardTabPanel } from './ClipboardTabPanel';

interface FileTabPanelProps {
	fileUploadRef: React.RefObject<FileUploadHandle>;
	initialFiles: StoredFile[];
	onFileChange: () => void;
	lastUpdatedFile: Date;
	hasContent: boolean;
	hasNoFileChanges: boolean;
	onClear: () => void;
	onSave: () => void;
	onRefresh: () => void;
}

function FileTabPanel({
	fileUploadRef,
	initialFiles,
	onFileChange,
	lastUpdatedFile,
	hasContent,
	hasNoFileChanges,
	onClear,
	onSave,
	onRefresh,
}: FileTabPanelProps) {
	const { user } = useSupabase();
	const { showToast } = useToast();

	// onSave() asks for sign-in itself when needed (and resumes the save after).
	function handleSave() {
		void onSave();
	}

	async function handleDownload() {
		try {
			await fileUploadRef.current?.download();
		} catch {
			showToast('Could not download file.', ToastSeverity.WARNING);
		}
	}

	const headerEndActions = [
		{
			id: 'download',
			label: 'Download',
			variant: 'outlined' as const,
			icon: <DownloadIcon />,
			onClick: () => void handleDownload(),
			disabled: !hasContent,
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
				disabled: user ? hasNoFileChanges : !hasContent,
			},
		],
	};

	return (
		<ClipboardTabPanel
			onRefresh={onRefresh}
			onClear={onClear}
			onSave={onSave}
			hasContent={hasContent}
			hasNoChanges={hasNoFileChanges}
			lastUpdated={lastUpdatedFile}
			onUpload={() => fileUploadRef.current?.trigger()}
			headerEndActions={headerEndActions}
			footerActions={footerActions}
		>
			<FileUpload
				ref={fileUploadRef}
				initialFiles={initialFiles}
				onChange={onFileChange}
			/>
		</ClipboardTabPanel>
	);
}

export { FileTabPanel };
