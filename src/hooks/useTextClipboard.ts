import { useCallback } from 'react';
import { ToastSeverity, useToast } from '../context/ToastProvider';
import { logErrorDetails } from '../utils/getErrorMessage';

function useTextClipboard(
	text: string,
	onTextChange: (value: string) => void,
) {
	const { showToast } = useToast();

	const copy = useCallback(async () => {
		try {
			await navigator.clipboard.writeText(text);
		} catch (error) {
			// Clipboard access may be denied or unavailable.
			logErrorDetails(error, 'Copy text to clipboard');
			showToast('Could not copy text to clipboard.', ToastSeverity.WARNING);
		}
	}, [text, showToast]);

	const paste = useCallback(async () => {
		try {
			const pasted = await navigator.clipboard.readText();
			if (pasted) {
				onTextChange(text + pasted);
			}
		} catch (error) {
			logErrorDetails(error, 'Paste text from clipboard');
			showToast('Could not paste from clipboard.', ToastSeverity.WARNING);
		}
	}, [text, onTextChange, showToast]);

	return { copy, paste };
}

export { useTextClipboard };
