import { Alert, Button } from '@mui/material';
import { Component, ErrorInfo, ReactNode, useEffect } from 'react';
import { useRouteError } from 'react-router-dom';
import { logErrorDetails } from '../../../utils/getErrorMessage';

/**
 * Shown instead of a page that crashed while rendering. Uses a full page
 * load for both actions so the app restarts from a clean state.
 */
function ErrorFallback() {
	return (
		<div
			role='alert'
			style={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				gap: '1rem',
				minHeight: '60vh',
				padding: '1rem',
			}}
		>
			<Alert severity='error'>
				Something went wrong showing this page.
			</Alert>
			<div style={{ display: 'flex', gap: '0.5rem' }}>
				<Button variant='contained' onClick={() => window.location.reload()}>
					Reload
				</Button>
				<Button variant='outlined' href='/'>
					Home
				</Button>
			</div>
		</div>
	);
}

interface ErrorBoundaryProps {
	children: ReactNode;
	/** Name used in the console log, e.g. 'Page'. */
	context?: string;
}

interface ErrorBoundaryState {
	hasError: boolean;
}

/**
 * Catches render errors below it so one broken page (e.g. malformed gist
 * data) shows a fallback instead of blanking the whole site. Give it a `key`
 * that changes on navigation so it resets when the user moves on.
 */
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
	state: ErrorBoundaryState = { hasError: false };

	static getDerivedStateFromError(): ErrorBoundaryState {
		return { hasError: true };
	}

	componentDidCatch(error: Error, info: ErrorInfo) {
		const context = this.props.context ?? 'Render';
		logErrorDetails(error, `${context} crashed`);
		if (info.componentStack) {
			console.error(`[${context} crashed] component stack:`, info.componentStack);
		}
	}

	render() {
		return this.state.hasError ? <ErrorFallback /> : this.props.children;
	}
}

/** Router `errorElement`: last-resort fallback if the app shell itself throws. */
function RouteErrorFallback() {
	const error = useRouteError();

	useEffect(() => {
		logErrorDetails(error, 'App crashed');
	}, [error]);

	return <ErrorFallback />;
}

export { ErrorBoundary, ErrorFallback, RouteErrorFallback };
