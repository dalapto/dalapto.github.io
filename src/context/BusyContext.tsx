import React, {
	createContext,
	ReactNode,
	useCallback,
	useContext,
	useMemo,
	useState,
} from 'react';
import type { LoadingVariant } from '../components/display/LoadingOverlay/LoadingOverlay';

type BusyOperation = 'fetch' | 'save' | 'delete';

interface BusyOptions {
	label?: string;
	variant?: LoadingVariant;
	operation?: BusyOperation;
}

interface BusyContextValue {
	busy: boolean;
	label: string | null;
	variant: LoadingVariant;
	operation: BusyOperation | null;
	setBusy: (active: boolean, options?: BusyOptions) => void;
}

const BusyContext = createContext<BusyContextValue | null>(null);

function busyTitle(
	operation: BusyOperation | null,
	label: string | null,
	fallback: string,
): string {
	if (!operation || !label) return fallback;
	switch (operation) {
		case 'fetch':
			return `Fetching ${label}…`;
		case 'save':
			return `Saving ${label}…`;
		case 'delete':
			return `Deleting ${label}…`;
	}
}

function BusyProvider({
	children,
	initialBusy = false,
}: {
	children: ReactNode;
	initialBusy?: boolean;
}) {
	const [busy, setBusyState] = useState(initialBusy);
	const [label, setLabel] = useState<string | null>(null);
	const [variant, setVariant] = useState<LoadingVariant>('spinner');
	const [operation, setOperation] = useState<BusyOperation | null>(null);

	const setBusy = useCallback((active: boolean, options?: BusyOptions) => {
		setBusyState(active);
		if (active) {
			setLabel(options?.label ?? null);
			setVariant(options?.variant ?? 'spinner');
			setOperation(options?.operation ?? null);
		} else {
			setLabel(null);
			setVariant('spinner');
			setOperation(null);
		}
	}, []);

	const value = useMemo(
		() => ({ busy, label, variant, operation, setBusy }),
		[busy, label, variant, operation, setBusy],
	);

	return (
		<BusyContext.Provider value={value}>{children}</BusyContext.Provider>
	);
}

function useBusy() {
	const ctx = useContext(BusyContext);
	if (!ctx) throw new Error('useBusy must be used within a BusyProvider');
	return ctx;
}

export { BusyProvider, busyTitle, useBusy };
export type { BusyOperation, BusyOptions };
