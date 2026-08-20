import GitHubIcon from '@mui/icons-material/GitHub';
import { Box, Link, Typography } from '@mui/material';
import React, { useState } from 'react';
import { colours } from '../../constants/colours';
import { useGitHub } from '../../context/GitHubContext';
import { ToastSeverity, useToast } from '../../context/ToastProvider';
import { getErrorMessage } from '../../utils/getErrorMessage';
import { StandardTextField } from '../controls/StandardTextField/StandardTextField';
import { AuthModal } from './AuthModal';

const TOKEN_URL =
	'https://github.com/settings/tokens/new?scopes=gist&description=dalapto.github.io';

interface GitHubAuthModalProps {
	open: boolean;
	onClose: () => void;
	onAuthenticated?: () => void;
}

function GitHubAuthModal({
	open,
	onClose,
	onAuthenticated,
}: GitHubAuthModalProps) {
	const { githubUser, authLoading, signIn, signOut } = useGitHub();
	const { showToast } = useToast();
	const [token, setToken] = useState('');

	async function handleSignIn() {
		try {
			await signIn(token.trim());
			showToast('Signed in successfully.', ToastSeverity.SUCCESS);
		} catch (error) {
			console.error(error);
			showToast(getErrorMessage(error), ToastSeverity.ERROR, error);
		}
	}

	async function handleSignOut() {
		signOut();
		showToast('Signed out successfully.', ToastSeverity.INFO);
		onClose();
	}

	const signedInContent = githubUser ? (
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
	) : null;

	const signedOutContent = (submitSignIn: () => void) => (
		<form
			onSubmit={(event) => {
				event.preventDefault();
				void submitSignIn();
			}}
			style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
		>
			<Typography variant='body2' sx={{ color: colours.textSecondary }}>
				Create a Personal Access Token with the{' '}
				<code style={{ color: colours.secondary }}>gist</code> scope, then paste
				it below.
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
	);

	return (
		<AuthModal
			open={open}
			onClose={onClose}
			onAuthenticated={onAuthenticated}
			authLoading={authLoading}
			isSignedIn={Boolean(githubUser)}
			loadingHeader='GitHub'
			signedInHeader='GitHub Account'
			signInHeader='Sign in with GitHub'
			onSignIn={handleSignIn}
			onSignOut={handleSignOut}
			signInDisabled={!token.trim()}
			onReset={() => setToken('')}
			signedInContent={signedInContent}
			signedOutContent={(submitSignIn) => signedOutContent(submitSignIn)}
		/>
	);
}

export { GitHubAuthModal };
