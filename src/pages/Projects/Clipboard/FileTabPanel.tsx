import React from 'react';
import type {
	FileUploadHandle,
	StoredFile,
} from '../../../components/controls/FileUpload/FileUpload';
import { FileUpload } from '../../../components/controls/FileUpload/FileUpload';
import { StandardButton } from '../../../components/controls/StandardButton/StandardButton';
import { ActionsPanel } from '../../../components/layout/ActionsPanel/ActionsPanel';
import { useSaving } from '../../../context/SavingContext';
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
	const { saving } = useSaving();
	return (
		<ActionsPanel
			onRefresh={onRefresh}
			leadingActions={
				<StandardButton
					variant='contained'
					onClick={() => fileUploadRef.current?.trigger()}
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
						disabled={hasNoFileChanges || saving}
						onClick={onSave}
					>
						Save
					</StandardButton>
				</>
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
