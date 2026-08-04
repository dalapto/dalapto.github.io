import React, {
	createContext,
	ReactNode,
	useContext,
	useMemo,
	useState,
} from 'react';

interface SavingContextValue {
	saving: boolean;
	setSaving: (saving: boolean) => void;
}

const SavingContext = createContext<SavingContextValue | null>(null);

function SavingProvider({ children }: { children: ReactNode }) {
	const [saving, setSaving] = useState(false);

	const value = useMemo(
		() => ({ saving, setSaving }),
		[saving],
	);

	return (
		<SavingContext.Provider value={value}>{children}</SavingContext.Provider>
	);
}

function useSaving() {
	const ctx = useContext(SavingContext);
	if (!ctx) throw new Error('useSaving must be used within a SavingProvider');
	return ctx;
}

export { SavingProvider, useSaving };
