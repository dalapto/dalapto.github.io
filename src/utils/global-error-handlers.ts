import { logErrorDetails } from './getErrorMessage';

/**
 * Logs errors nothing else caught (event handlers, timers, un-awaited
 * promises) with a consistent label, so they are easy to find in the console.
 */
function installGlobalErrorHandlers() {
	window.addEventListener('error', (event) => {
		logErrorDetails(event.error ?? event.message, 'Uncaught error');
	});
	window.addEventListener('unhandledrejection', (event) => {
		logErrorDetails(event.reason, 'Unhandled promise rejection');
	});
}

export { installGlobalErrorHandlers };
