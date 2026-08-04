import { Dialog, DialogContent, DialogTitle, TextField } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { colours } from '../../constants/colours';
import { useSupabase } from '../../context/SupabaseContext';
import { useToast } from '../../context/ToastProvider';
import { getErrorMessage } from '../../utils/getErrorMessage';
import { StandardButton } from '../controls/StandardButton/StandardButton';

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

	return (
		<Dialog
			open={open}
			onClose={onClose}
			maxWidth='xs'
			fullWidth
			PaperProps={{
				sx: {
					bgcolor: colours.primary,
					color: colours.text,
					'& .MuiInputLabel-root': { color: colours.textSecondary },
					'& .MuiOutlinedInput-root': {
						color: colours.text,
						'& fieldset': { borderColor: colours.textSecondary },
						'&:hover fieldset': { borderColor: colours.secondary },
						'&.Mui-focused fieldset': { borderColor: colours.secondary },
					},
				},
			}}
		>
			<DialogTitle sx={{ color: colours.text }}>
				{user ? 'Account' : 'Sign in to save'}
			</DialogTitle>
			<DialogContent sx={{ color: colours.text }}>
				{authLoading ? (
					<p>Checking sign-in…</p>
				) : user ? (
					<div
						style={{
							display: 'flex',
							flexDirection: 'column',
							gap: '1rem',
							paddingTop: '0.25rem',
						}}
					>
						<p>
							Signed in as{' '}
							<span style={{ color: colours.secondary }}>{user.email}</span>
						</p>
						<div
							style={{
								display: 'flex',
								justifyContent: 'flex-end',
								gap: '0.5rem',
							}}
						>
							<StandardButton variant='outlined' onClick={onClose}>
								Close
							</StandardButton>
							<StandardButton
								variant='contained'
								disabled={submitting}
								onClick={handleSignOut}
							>
								{submitting ? 'Please wait…' : 'Sign out'}
							</StandardButton>
						</div>
					</div>
				) : (
					<form
						onSubmit={handleSubmit}
						style={{
							display: 'flex',
							flexDirection: 'column',
							gap: '1rem',
							paddingTop: '0.25rem',
						}}
					>
						<TextField
							type='email'
							required
							autoFocus
							label='Email'
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							fullWidth
						/>
						<TextField
							type='password'
							required
							label='Password'
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							fullWidth
							inputProps={{ minLength: 6 }}
						/>
						<div
							style={{
								display: 'flex',
								justifyContent: 'flex-end',
								gap: '0.5rem',
							}}
						>
							<StandardButton variant='outlined' onClick={onClose}>
								Cancel
							</StandardButton>
							<StandardButton
								variant='contained'
								disabled={submitting}
								onClick={submitAuth}
							>
								{submitting ? 'Please wait…' : 'Sign in'}
							</StandardButton>
						</div>
					</form>
				)}
			</DialogContent>
		</Dialog>
	);
}

export { AuthModal };
