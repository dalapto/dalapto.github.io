import React from 'react';
import type {
	FileUploadHandle,
	StoredFile,
} from '../../../components/controls/FileUpload/FileUpload';
import { FileUpload } from '../../../components/controls/FileUpload/FileUpload';
import { ActionsPanel } from '../../../components/layout/ActionsPanel/ActionsPanel';
import {
	ClipboardTabActions,
	ClipboardUploadButton,
} from './ClipboardButtons';
import { ClipboardContentMeta } from './ClipboardContentMeta';

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
		<ActionsPanel
			onRefresh={onRefresh}
			leadingActions={
				<ClipboardUploadButton
					onClick={() => fileUploadRef.current?.trigger()}
				/>
			}
			actions={
				<ClipboardTabActions
					hasContent={hasContent}
					hasNoChanges={hasNoFileChanges}
					onClear={onClear}
					onSave={onSave}
				/>
			}
		>
			<FileUpload
				ref={fileUploadRef}
				initialFiles={initialFiles}
				onChange={onFileChange}
			/>
			<ClipboardContentMeta
				lastUpdated={lastUpdatedFile}
				hasContent={hasContent}
			/>
		</ActionsPanel>
	);
}

export { FileTabPanel };
