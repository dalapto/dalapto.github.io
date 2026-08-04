import React, {
	createContext,
	ReactNode,
	useContext,
	useMemo,
	useState,
} from 'react';

interface LoadingContextValue {
	loading: boolean;
	setLoading: (loading: boolean) => void;
}

const LoadingContext = createContext<LoadingContextValue | null>(null);

function LoadingProvider({
	children,
	initialLoading = false,
}: {
	children: ReactNode;
	initialLoading?: boolean;
}) {
	const [loading, setLoading] = useState(initialLoading);

	const value = useMemo(
		() => ({ loading, setLoading }),
		[loading],
	);

	return (
		<LoadingContext.Provider value={value}>{children}</LoadingContext.Provider>
	);
}

function useLoading() {
	const ctx = useContext(LoadingContext);
	if (!ctx) throw new Error('useLoading must be used within a LoadingProvider');
	return ctx;
}

export { LoadingProvider, useLoading };
