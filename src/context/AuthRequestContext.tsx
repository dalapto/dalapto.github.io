import React, {
	createContext,
	useCallback,
	useContext,
	useMemo,
	useRef,
} from 'react';

type AuthRequestContextValue = {
	requestAuth: () => void;
	registerAuthRequestHandler: (handler: (() => void) | null) => void;
};

const AuthRequestContext = createContext<AuthRequestContextValue | null>(null);

function AuthRequestProvider({ children }: { children: React.ReactNode }) {
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
		<AuthRequestContext.Provider value={value}>
			{children}
		</AuthRequestContext.Provider>
	);
}

function useAuthRequest() {
	const context = useContext(AuthRequestContext);
	if (!context) {
		throw new Error('useAuthRequest must be used within AuthRequestProvider');
	}
	return context;
}

export { AuthRequestProvider, useAuthRequest };
