import { useCallback } from 'react';

function useTextClipboard(
	text: string,
	onTextChange: (value: string) => void,
) {
	const copy = useCallback(async () => {
		try {
			await navigator.clipboard.writeText(text);
		} catch {
			// Clipboard access may be denied or unavailable.
		}
	}, [text]);

	const paste = useCallback(async () => {
		try {
			const pasted = await navigator.clipboard.readText();
			if (pasted) {
				onTextChange(text + pasted);
			}
		} catch {
			// Clipboard access may be denied or unavailable.
		}
	}, [text, onTextChange]);

	return { copy, paste };
}

export { useTextClipboard };
