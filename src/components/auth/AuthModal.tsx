import React, { useEffect, useRef, useState } from 'react';
import type { ActionConfig } from '../../types/basic.types';
import { FormPanel } from '../layout/FormPanel/FormPanel';
import { StandardModal } from '../layout/StandardModal/StandardModal';

interface AuthModalProps {
	open: boolean;
	onClose: () => void;
	onAuthenticated?: () => void;
	authLoading: boolean;
	isSignedIn: boolean;
	loadingHeader: string;
	signedInHeader: string;
	signInHeader: string;
	signedInContent: React.ReactNode;
	signedOutContent: (submitSignIn: () => void) => React.ReactNode;
	onSignIn: () => void | Promise<void>;
	onSignOut: () => void | Promise<void>;
	signInDisabled?: boolean;
	onReset?: () => void;
}

function AuthModal({
	open,
	onClose,
	onAuthenticated,
	authLoading,
	isSignedIn,
	loadingHeader,
	signedInHeader,
	signInHeader,
	signedInContent,
	signedOutContent,
	onSignIn,
	onSignOut,
	signInDisabled = false,
	onReset,
}: AuthModalProps) {
	const [submitting, setSubmitting] = useState(false);
	const signedInWhenOpenedRef = useRef(false);
	const prevOpenRef = useRef(false);

	useEffect(() => {
		const wasOpen = prevOpenRef.current;

		if (open && !wasOpen) {
			signedInWhenOpenedRef.current = isSignedIn;
		}

		if (!open && wasOpen) {
			setSubmitting(false);
			onReset?.();
		}

		prevOpenRef.current = open;
	}, [open, isSignedIn, onReset]);

	useEffect(() => {
		if (open && isSignedIn && !signedInWhenOpenedRef.current) {
			onAuthenticated?.();
		}
	}, [open, isSignedIn, onAuthenticated]);

	async function submitSignIn() {
		setSubmitting(true);
		try {
			await onSignIn();
		} finally {
			setSubmitting(false);
		}
	}

	async function submitSignOut() {
		setSubmitting(true);
		try {
			await onSignOut();
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
			onClick: () => void submitSignOut(),
		},
	];

	const signInFooter: ActionConfig[] = [
		{ id: 'cancel', label: 'Cancel', variant: 'outlined', onClick: onClose },
		{
			id: 'signin',
			label: submitting ? 'Please wait…' : 'Sign in',
			variant: 'contained',
			disabled: submitting || signInDisabled,
			onClick: () => void submitSignIn(),
		},
	];

	return (
		<StandardModal open={open} onClose={onClose}>
			{authLoading ? (
				<FormPanel header={loadingHeader}>
					<p>Checking sign-in…</p>
				</FormPanel>
			) : isSignedIn ? (
				<FormPanel header={signedInHeader} footerActions={signedInFooter}>
					{signedInContent}
				</FormPanel>
			) : (
				<FormPanel header={signInHeader} footerActions={signInFooter}>
					{signedOutContent(submitSignIn)}
				</FormPanel>
			)}
		</StandardModal>
	);
}

export { AuthModal };
export type { AuthModalProps };
