import GitHubIcon from '@mui/icons-material/GitHub';
import { Box, Link, Typography } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { colours } from '../../constants/colours';
import { useGitHub } from '../../context/GitHubContext';
import { useToast } from '../../context/ToastProvider';
import { getErrorMessage } from '../../utils/getErrorMessage';
import type { ActionConfig } from '../../types/basic.types';
import { StandardTextField } from '../controls/StandardTextField/StandardTextField';
import { FormPanel } from '../layout/FormPanel/FormPanel';
import { StandardModal } from '../layout/StandardModal/StandardModal';

const TOKEN_URL =
	'https://github.com/settings/tokens/new?scopes=gist&description=dalapto.github.io';

interface GitHubAuthModalProps {
	open: boolean;
	onClose: () => void;
	onAuthenticated?: () => void;
}

function GitHubAuthModal({ open, onClose, onAuthenticated }: GitHubAuthModalProps) {
	const { githubUser, authLoading, signIn, signOut } = useGitHub();
	const { showToast } = useToast();
	const [token, setToken] = useState('');
	const [submitting, setSubmitting] = useState(false);
	const userWhenOpenedRef = useRef(false);
	const prevOpenRef = useRef(false);

	useEffect(() => {
		if (open && !prevOpenRef.current) {
			userWhenOpenedRef.current = Boolean(githubUser);
		}
		prevOpenRef.current = open;
	}, [open, githubUser]);

	useEffect(() => {
		if (open && githubUser && !userWhenOpenedRef.current) {
			onAuthenticated?.();
		}
	}, [open, githubUser, onAuthenticated]);

	useEffect(() => {
		if (!open) {
			setToken('');
			setSubmitting(false);
		}
	}, [open]);

	async function handleSignIn() {
		setSubmitting(true);
		try {
			await signIn(token.trim());
			showToast('Signed in to GitHub.', 'success');
		} catch (error) {
			showToast(getErrorMessage(error), 'error', error);
		} finally {
			setSubmitting(false);
		}
	}

	function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		void handleSignIn();
	}

	async function handleSignOut() {
		setSubmitting(true);
		try {
			signOut();
			showToast('Signed out of GitHub.', 'success');
			onClose();
		} finally {
			setSubmitting(false);
		}
	}

	const signedInFooter: ActionConfig[] = [
		{ id: 'close', label: 'Close', variant: 'outlined', onClick: onClose },
		{
			id: 'signout',
			label: submitting ? 'Please wait…' : 'Sign out',
			variant: 'contained',
			disabled: submitting,
			onClick: () => void handleSignOut(),
		},
	];

	const signInFooter: ActionConfig[] = [
		{ id: 'cancel', label: 'Cancel', variant: 'outlined', onClick: onClose },
		{
			id: 'signin',
			label: submitting ? 'Please wait…' : 'Sign in',
			variant: 'contained',
			disabled: submitting || !token.trim(),
			onClick: () => void handleSignIn(),
		},
	];

	return (
		<StandardModal open={open} onClose={onClose}>
			{authLoading ? (
				<FormPanel header='GitHub'>
					<p>Checking sign-in…</p>
				</FormPanel>
			) : githubUser ? (
				<FormPanel header='GitHub Account' footerActions={signedInFooter}>
					<Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
						<Box
							component='img'
							src={githubUser.avatar_url}
							alt={githubUser.login}
							sx={{ width: 40, height: 40, borderRadius: '50%' }}
						/>
						<Box>
							<Typography sx={{ color: colours.secondary, fontWeight: 'bold' }}>
								@{githubUser.login}
							</Typography>
							{githubUser.name && (
								<Typography variant='body2' sx={{ color: colours.textSecondary }}>
									{githubUser.name}
								</Typography>
							)}
						</Box>
					</Box>
				</FormPanel>
			) : (
				<FormPanel header='Sign in with GitHub' footerActions={signInFooter}>
					<form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
						<Typography variant='body2' sx={{ color: colours.textSecondary }}>
							Create a Personal Access Token with the{' '}
							<code style={{ color: colours.secondary }}>gist</code> scope, then paste it below.
						</Typography>
						<Link
							href={TOKEN_URL}
							target='_blank'
							rel='noopener noreferrer'
							sx={{
								display: 'inline-flex',
								alignItems: 'center',
								gap: 0.5,
								color: colours.link,
								fontSize: '0.875rem',
								width: 'fit-content',
							}}
						>
							<GitHubIcon fontSize='small' />
							Generate token on GitHub
						</Link>
						<StandardTextField
							type='password'
							label='Personal Access Token'
							value={token}
							onChange={(e) => setToken(e.target.value)}
							fullWidth
							autoFocus
							required
						/>
					</form>
				</FormPanel>
			)}
		</StandardModal>
	);
}

export { GitHubAuthModal };
