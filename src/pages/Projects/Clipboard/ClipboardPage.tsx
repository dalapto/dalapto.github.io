import { Box, useMediaQuery, useTheme } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { AuthIconButton } from '../../../components/auth/AuthIconButton';
import { SupabaseAuthModal } from '../../../components/auth/SupabaseAuthModal';
import type { FileUploadHandle } from '../../../components/controls/FileUpload/FileUpload';
import type { ImageUploadHandle } from '../../../components/controls/ImageUpload/ImageUpload';
import { LoadingOverlay } from '../../../components/display/LoadingOverlay/LoadingOverlay';
import { JsonSection } from '../../../components/Json/JsonSection/JsonSection';
import { TabbedPanel } from '../../../components/Json/JsonTabs/TabbedPanel';
import { ImgPaths } from '../../../constants/img-paths';
import { useAuthRequest } from '../../../context/AuthRequestContext';
import { busyTitle, useBusy } from '../../../context/BusyContext';
import { useSupabase } from '../../../context/SupabaseContext';
import type { JsonTab } from '../../../types/basic.types';
import { FileTabPanel } from './FileTabPanel';
import { ImageTabPanel } from './ImageTabPanel';
import { TextTabPanel } from './TextTabPanel';
import { useClipboard } from './useClipboard';

function Clipboard() {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
	const { busy, label, variant, operation } = useBusy();
	const { user, authLoading } = useSupabase();
	const { registerAuthRequestHandler } = useAuthRequest();
	const [authModalOpen, setAuthModalOpen] = useState(false);

	useEffect(() => {
		registerAuthRequestHandler(() => {
			setAuthModalOpen(true);
		});
		return () => registerAuthRequestHandler(null);
	}, [registerAuthRequestHandler]);

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
	} = useClipboard();

	function handleAuthCancel() {
		setAuthModalOpen(false);
		cancelPendingSave();
	}

	function handleAuthenticated() {
		setAuthModalOpen(false);
		flushPendingSave();
	}

	const spinnerBusy = busy && variant === 'spinner';
	const progressBusy = busy && variant === 'progress';

	const pageLoadingTitle =
		spinnerBusy && authLoading
			? 'Loading…'
			: spinnerBusy
				? busyTitle('fetch', label, 'Fetching saved content…')
				: 'Restoring session…';

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
		<Box
			key='clipboard-panel'
			sx={{
				position: { sm: 'relative' },
				width: { xs: '100%', sm: 'fit-content' },
				maxWidth: '100%',
				mx: 'auto',
			}}
		>
			{!isMobile && (
				<Box
					sx={{
						position: 'absolute',
						top: 8,
						right: 12,
						zIndex: 10,
					}}
				>
					<AuthIconButton
						inline
						user={user}
						authLoading={authLoading}
						onClick={() => setAuthModalOpen(true)}
					/>
				</Box>
			)}
			<TabbedPanel
				tabs={tabs}
				ariaLabel='Clipboard tabs'
				initialTabId={lastTab}
				tabSize='large'
			/>
		</Box>
	);

	return (
		<>
			<LoadingOverlay
				open={spinnerBusy || authLoading}
				title={pageLoadingTitle}
				variant='spinner'
			/>
			<LoadingOverlay
				open={progressBusy}
				title={busyTitle(operation, label, 'Saving changes…')}
				variant='progress'
			/>
			<SupabaseAuthModal
				open={authModalOpen}
				onClose={handleAuthCancel}
				onAuthenticated={handleAuthenticated}
			/>
			<JsonSection
				items={[clipboardPanel]}
				gap='8rem'
				paddingTop={isMobile ? '0.25rem' : '1rem'}
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

export { Clipboard };
