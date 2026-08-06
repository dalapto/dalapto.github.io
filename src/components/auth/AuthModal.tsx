import React, { useEffect, useRef, useState } from 'react';
import { colours } from '../../constants/colours';
import { useSupabase } from '../../context/SupabaseContext';
import { useToast } from '../../context/ToastProvider';
import type { ActionConfig } from '../../types/basic.types';
import { getErrorMessage } from '../../utils/getErrorMessage';
import { StandardTextField } from '../controls/StandardTextField/StandardTextField';
import { FormPanel } from '../layout/FormPanel/FormPanel';
import { StandardModal } from '../layout/StandardModal/StandardModal';

interface AuthModalProps {
	open: boolean;
	onClose: () => void;
	onAuthenticated?: () => void;
}

function AuthModal({ open, onClose, onAuthenticated }: AuthModalProps) {
	const { user, authLoading, signInWithPassword, signOut } = useSupabase();
	const { showToast } = useToast();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [submitting, setSubmitting] = useState(false);
	const userWhenOpenedRef = useRef<boolean>(false);
	const prevOpenRef = useRef(false);

	useEffect(() => {
		if (open && !prevOpenRef.current) {
			userWhenOpenedRef.current = Boolean(user);
		}
		prevOpenRef.current = open;
	}, [open, user]);

	useEffect(() => {
		if (open && user && !userWhenOpenedRef.current) {
			onAuthenticated?.();
		}
	}, [open, user, onAuthenticated]);

	useEffect(() => {
		if (!open) {
			setEmail('');
			setPassword('');
			setSubmitting(false);
		}
	}, [open]);

	async function handleSignOut() {
		setSubmitting(true);
		try {
			await signOut();
			showToast('Signed out.', 'success');
			onClose();
		} catch (error) {
			showToast(getErrorMessage(error), 'error', error);
		} finally {
			setSubmitting(false);
		}
	}

	async function submitAuth() {
		setSubmitting(true);
		const trimmedEmail = email.trim();
		try {
			await signInWithPassword(trimmedEmail, password);
			showToast('Signed in.', 'success');
		} catch (error) {
			showToast(getErrorMessage(error), 'error', error);
		} finally {
			setSubmitting(false);
		}
	}

	function handleSubmit(event: React.FormEvent) {
		event.preventDefault();
		void submitAuth();
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
			disabled: submitting,
			onClick: () => void submitAuth(),
		},
	];

	return (
		<StandardModal open={open} onClose={onClose}>
			{authLoading ? (
				<FormPanel header={user ? 'Account' : 'Sign in'}>
					<p>Checking sign-in…</p>
				</FormPanel>
			) : user ? (
				<FormPanel header='Account' footerActions={signedInFooter}>
					<p>
						Signed in as{' '}
						<span style={{ color: colours.secondary }}>{user.email}</span>
					</p>
				</FormPanel>
			) : (
				<FormPanel header='Sign in' footerActions={signInFooter}>
					<form
						onSubmit={handleSubmit}
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
				</FormPanel>
			)}
		</StandardModal>
	);
}

export { AuthModal };
