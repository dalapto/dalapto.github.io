import React, { useState } from 'react';
import { AuthIconButton } from '../../../components/auth/AuthIconButton';
import { AuthModal } from '../../../components/auth/AuthModal';
import type { FileUploadHandle } from '../../../components/controls/FileUpload/FileUpload';
import type { ImageUploadHandle } from '../../../components/controls/ImageUpload/ImageUpload';
import { LoadingOverlay } from '../../../components/display/LoadingOverlay/LoadingOverlay';
import { JsonSection } from '../../../components/Json/JsonSection/JsonSection';
import { TabbedPanel } from '../../../components/Json/JsonTabs/TabbedPanel';
import { ImgPaths } from '../../../constants/img-paths';
import { LoadingProvider, useLoading } from '../../../context/LoadingContext';
import { SavingProvider, useSaving } from '../../../context/SavingContext';
import { useSupabase } from '../../../context/SupabaseContext';
import type { JsonTab } from '../../../types/basic.types';
import { FileTabPanel } from './FileTabPanel';
import { ImageTabPanel } from './ImageTabPanel';
import { TextTabPanel } from './TextTabPanel';
import { useClipboard } from './useClipboard';

// TODO : undo / redo
// undo resets content to supa content
// redo resets content back

function ClipboardContent() {
	const { loading } = useLoading();
	const { saving } = useSaving();
	const { user, authLoading } = useSupabase();
	const [authModalOpen, setAuthModalOpen] = useState(false);
	const {
		fileUploadRef,
		hasFileContent,
		hasImageContent,
		hasNoFileChanges,
		hasNoImageChanges,
		hasNoTextChanges,
		hasTextContent,
		imageUploadRef,
		lastTab,
		lastUpdatedFile,
		lastUpdatedImage,
		lastUpdatedText,
		loadedFiles,
		loadedImages,
		textContent,
		cancelPendingSave,
		clearFile,
		clearImage,
		clearText,
		flushPendingSave,
		refreshClipboard,
		onFileChange,
		onImageChange,
		saveFile,
		saveImage,
		saveText,
		setTextContent,
	} = useClipboard(() => setAuthModalOpen(true));

	function handleAuthCancel() {
		setAuthModalOpen(false);
		cancelPendingSave();
	}

	function handleAuthenticated() {
		setAuthModalOpen(false);
		flushPendingSave();
	}

	if (loading) {
		return (
			<LoadingOverlay open title='Fetching saved content…' variant='spinner' />
		);
	}

	const tabs: JsonTab[] = [
		{
			id: 'text',
			label: 'Text',
			content: (
				<TextTabPanel
					textContent={textContent}
					onTextChange={setTextContent}
					lastUpdatedText={lastUpdatedText}
					hasContent={hasTextContent}
					hasNoTextChanges={hasNoTextChanges}
					onClear={clearText}
					onSave={saveText}
					onRefresh={refreshClipboard}
				/>
			),
		},
		{
			id: 'image',
			label: 'Image',
			content: (
				<ImageTabPanel
					imageUploadRef={imageUploadRef as React.RefObject<ImageUploadHandle>}
					initialImages={loadedImages}
					onImageChange={onImageChange}
					lastUpdatedImage={lastUpdatedImage}
					hasContent={hasImageContent}
					hasNoImageChanges={hasNoImageChanges}
					onClear={clearImage}
					onSave={saveImage}
					onRefresh={refreshClipboard}
				/>
			),
		},
		{
			id: 'file',
			label: 'File',
			content: (
				<FileTabPanel
					fileUploadRef={fileUploadRef as React.RefObject<FileUploadHandle>}
					initialFiles={loadedFiles}
					onFileChange={onFileChange}
					lastUpdatedFile={lastUpdatedFile}
					hasContent={hasFileContent}
					hasNoFileChanges={hasNoFileChanges}
					onClear={clearFile}
					onSave={saveFile}
					onRefresh={refreshClipboard}
				/>
			),
		},
	];

	const clipboardPanel = (
		<div
			key='clipboard-panel'
			style={{
				position: 'relative',
				width: 'fit-content',
				margin: '0 auto',
			}}
		>
			<AuthIconButton
				user={user}
				authLoading={authLoading}
				onClick={() => setAuthModalOpen(true)}
			/>
			<TabbedPanel
				tabs={tabs}
				ariaLabel='Clipboard tabs'
				initialTabId={lastTab}
				tabSize='large'
			/>
		</div>
	);

	return (
		<>
			<LoadingOverlay
				open={saving}
				title='Saving changes...'
				variant='progress'
			/>
			<AuthModal
				open={authModalOpen}
				onClose={handleAuthCancel}
				onAuthenticated={handleAuthenticated}
			/>
			<JsonSection
				items={[clipboardPanel]}
				gap='8rem'
				paddingTop='1rem'
				paddingBottom='2rem'
				background={{
					image: {
						src: ImgPaths.pages.clipboard.windowapple,
						alt: 'A green apple with a bite taken out of it, sitting next to a tiny window.',
					},
					imagePosition: '-10% 50%',
				}}
			/>
		</>
	);
}

function Clipboard() {
	return (
		<LoadingProvider initialLoading>
			<SavingProvider>
				<ClipboardContent />
			</SavingProvider>
		</LoadingProvider>
	);
}

export { Clipboard };
