import { Box, useMediaQuery, useTheme } from '@mui/material';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AuthIconButton } from '../../../components/auth/AuthIconButton';
import { GitHubAuthModal } from '../../../components/auth/GitHubAuthModal';
import { LoadingOverlay } from '../../../components/display/LoadingOverlay/LoadingOverlay';
import { JsonSection } from '../../../components/Json/JsonSection/JsonSection';
import { TabbedPanel } from '../../../components/Json/JsonTabs/TabbedPanel';
import { ImgPaths } from '../../../constants/img-paths';
import { useAuthRequest } from '../../../context/AuthRequestContext';
import { useGitHub } from '../../../context/GitHubContext';
import { busyTitle, useBusy } from '../../../context/BusyContext';
import { ToastSeverity, useToast } from '../../../context/ToastProvider';
import { listFolders } from '../../../services/github.service';
import type { JsonTab } from '../../../types/basic.types';
import type { Folder } from '../../../types/github.types';
import { getErrorMessage } from '../../../utils/getErrorMessage';
import { CreateNoteTabPanel } from './CreateNoteTabPanel';
import { EditNoteTabPanel } from './EditNoteTabPanel';

function Notes() {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
	const { githubUser, githubToken, authLoading } = useGitHub();
	const { busy, label, variant, operation } = useBusy();
	const { requestAuth, registerAuthRequestHandler } = useAuthRequest();
	const { showToast } = useToast();
	const [authModalOpen, setAuthModalOpen] = useState(false);
	const [foldersLoading, setFoldersLoading] = useState(false);
	const pendingSaveRef = useRef(false);

	const [folders, setFolders] = useState<Folder[]>([]);

	const loadFolders = useCallback(async (token: string) => {
		const loaded = await listFolders(token);
		setFolders(loaded.sort((a, b) => a.name.localeCompare(b.name)));
	}, []);

	useEffect(() => {
		registerAuthRequestHandler(() => setAuthModalOpen(true));
		return () => registerAuthRequestHandler(null);
	}, [registerAuthRequestHandler]);

	useEffect(() => {
		if (!githubToken) {
			setFolders([]);
			return;
		}
		setFoldersLoading(true);
		loadFolders(githubToken)
			.catch((error) => {
				console.error(error);
				showToast(getErrorMessage(error), ToastSeverity.ERROR, error);
			})
			.finally(() => setFoldersLoading(false));
	}, [githubToken, loadFolders, showToast]);

	function handleAuthRequired() {
		pendingSaveRef.current = true;
		requestAuth();
	}

	function handleAuthenticated() {
		setAuthModalOpen(false);
		if (pendingSaveRef.current) {
			pendingSaveRef.current = false;
		}
	}

	function handleAuthClose() {
		pendingSaveRef.current = false;
		setAuthModalOpen(false);
	}

	const handleSaved = useCallback(async () => {
		if (!githubToken) return;
		setFoldersLoading(true);
		try {
			await loadFolders(githubToken);
		} catch (error) {
			console.error(error);
			showToast(getErrorMessage(error), ToastSeverity.ERROR, error);
		} finally {
			setFoldersLoading(false);
		}
	}, [githubToken, loadFolders, showToast]);

	const spinnerBusy = busy && variant === 'spinner';
	const progressBusy = busy && variant === 'progress';

	const pageLoadingTitle =
		spinnerBusy && label
			? busyTitle('fetch', label, 'Loading notes…')
			: authLoading && foldersLoading
				? 'Loading…'
				: authLoading
					? 'Restoring session…'
					: 'Loading notes…';

	const progressTitle =
		operation === 'delete'
			? busyTitle('delete', label, 'Deleting note…')
			: busyTitle('save', label, 'Saving changes…');

	const tabs: JsonTab[] = [
		{
			id: 'create',
			label: 'Create',
			content: (
				<CreateNoteTabPanel
					folders={folders}
					githubToken={githubToken}
					onSaved={handleSaved}
					onAuthRequired={handleAuthRequired}
					showToast={showToast}
				/>
			),
		},
		{
			id: 'edit',
			label: 'Edit',
			content: (
				<EditNoteTabPanel
					folders={folders}
					githubToken={githubToken}
					onSaved={handleSaved}
					onAuthRequired={handleAuthRequired}
					showToast={showToast}
				/>
			),
		},
	];

	const notesPanel = (
		<Box
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
						user={githubUser}
						authLoading={authLoading}
						onClick={() => setAuthModalOpen(true)}
					/>
				</Box>
			)}
			<TabbedPanel
				tabs={tabs}
				ariaLabel='Notes tabs'
				initialTabId='create'
				tabSize='large'
			/>
		</Box>
	);

	return (
		<>
			<LoadingOverlay
				open={authLoading || foldersLoading || spinnerBusy}
				title={pageLoadingTitle}
				variant='spinner'
			/>
			<LoadingOverlay
				open={progressBusy}
				title={progressTitle}
				variant='progress'
			/>
			<GitHubAuthModal
				open={authModalOpen}
				onClose={handleAuthClose}
				onAuthenticated={handleAuthenticated}
			/>
			<JsonSection
				gap='8rem'
				paddingTop={isMobile ? '0.25rem' : '1rem'}
				paddingBottom='2rem'
				background={{
					image: {
						src: ImgPaths.pages.clipboard.graffiti,
						alt: 'Inspirational graffiti, next to Homer Simpson.',
					},
					imagePosition: '20% 45%',
				}}
				items={[notesPanel]}
			/>
		</>
	);
}

export { Notes };
