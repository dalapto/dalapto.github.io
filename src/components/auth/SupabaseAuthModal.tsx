import React, { useState } from 'react';
import { colours } from '../../constants/colours';
import { useSupabase } from '../../context/SupabaseContext';
import { ToastSeverity, useToast } from '../../context/ToastProvider';
import { getErrorMessage } from '../../utils/getErrorMessage';
import { StandardTextField } from '../controls/StandardTextField/StandardTextField';
import { AuthModal } from './AuthModal';

interface SupabaseAuthModalProps {
	open: boolean;
	onClose: () => void;
	onAuthenticated?: () => void;
}

function SupabaseAuthModal({
	open,
	onClose,
	onAuthenticated,
}: SupabaseAuthModalProps) {
	const { user, authLoading, signInWithPassword, signOut } = useSupabase();
	const { showToast } = useToast();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	async function handleSignIn() {
		try {
			await signInWithPassword(email.trim(), password);
			showToast('Signed in successfully.', ToastSeverity.SUCCESS);
		} catch (error) {
			console.error(error);
			showToast(getErrorMessage(error), ToastSeverity.ERROR, error);
		}
	}

	async function handleSignOut() {
		try {
			await signOut();
			showToast('Signed out successfully.', ToastSeverity.INFO);
			onClose();
		} catch (error) {
			console.error(error);
			showToast(getErrorMessage(error), ToastSeverity.ERROR, error);
		}
	}

	const signedInContent = user ? (
		<p>
			Signed in as{' '}
			<span style={{ color: colours.secondary }}>{user?.email}</span>
		</p>
	) : null;

	const signedOutContent = (submitSignIn: () => void) => (
		<form
			onSubmit={(event) => {
				event.preventDefault();
				void submitSignIn();
			}}
			style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
		>
			<StandardTextField
				type='email'
				required
				autoFocus
				label='Email'
				value={email}
				onChange={(e) => setEmail(e.target.value)}
				fullWidth
			/>
			<StandardTextField
				type='password'
				required
				label='Password'
				value={password}
				onChange={(e) => setPassword(e.target.value)}
				fullWidth
				inputProps={{ minLength: 6 }}
			/>
		</form>
	);

	return (
		<AuthModal
			open={open}
			onClose={onClose}
			onAuthenticated={onAuthenticated}
			authLoading={authLoading}
			isSignedIn={Boolean(user)}
			loadingHeader={user ? 'Account' : 'Sign in'}
			signedInHeader='Account'
			signInHeader='Sign in'
			onSignIn={handleSignIn}
			onSignOut={handleSignOut}
			onReset={() => {
				setEmail('');
				setPassword('');
			}}
			signedInContent={signedInContent}
			signedOutContent={(submitSignIn) => signedOutContent(submitSignIn)}
		/>
	);
}

export { SupabaseAuthModal };
