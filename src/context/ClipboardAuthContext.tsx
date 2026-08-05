import React, {
	createContext,
	useCallback,
	useContext,
	useMemo,
	useRef,
} from 'react';

type ClipboardAuthContextValue = {
	requestAuth: () => void;
	registerAuthRequestHandler: (handler: (() => void) | null) => void;
};

const ClipboardAuthContext = createContext<ClipboardAuthContextValue | null>(
	null,
);

function ClipboardAuthProvider({ children }: { children: React.ReactNode }) {
	const handlerRef = useRef<(() => void) | null>(null);

	const registerAuthRequestHandler = useCallback(
		(handler: (() => void) | null) => {
			handlerRef.current = handler;
		},
		[],
	);

	const requestAuth = useCallback(() => {
		handlerRef.current?.();
	}, []);

	const value = useMemo(
		() => ({ requestAuth, registerAuthRequestHandler }),
		[requestAuth, registerAuthRequestHandler],
	);

	return (
		<ClipboardAuthContext.Provider value={value}>
			{children}
		</ClipboardAuthContext.Provider>
	);
}

function useClipboardAuth() {
	const context = useContext(ClipboardAuthContext);
	if (!context) {
		throw new Error(
			'useClipboardAuth must be used within ClipboardAuthProvider',
		);
	}
	return context;
}

export { ClipboardAuthProvider, useClipboardAuth };
