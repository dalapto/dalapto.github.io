import React from 'react';
import type {
	FileUploadHandle,
	StoredFile,
} from '../../../components/controls/FileUpload/FileUpload';
import { FileUpload } from '../../../components/controls/FileUpload/FileUpload';
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
	return (
		<ClipboardTabPanel
			onRefresh={onRefresh}
			onClear={onClear}
			onSave={onSave}
			hasContent={hasContent}
			hasNoChanges={hasNoFileChanges}
			lastUpdated={lastUpdatedFile}
			onUpload={() => fileUploadRef.current?.trigger()}
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
