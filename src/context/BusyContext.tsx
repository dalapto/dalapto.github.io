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
	/** Independent busy slot so overlapping fetches do not clear each other. */
	source?: string;
}

interface BusyEntry {
	label: string | null;
	variant: LoadingVariant;
	operation: BusyOperation | null;
}

interface BusyContextValue {
	busy: boolean;
	label: string | null;
	variant: LoadingVariant;
	operation: BusyOperation | null;
	setBusy: (active: boolean, options?: BusyOptions) => void;
}

const DEFAULT_BUSY_SOURCE = 'default';

function pickBusyEntry(entries: Record<string, BusyEntry>): BusyEntry | null {
	const list = Object.values(entries);
	if (list.length === 0) return null;
	return (
		[...list]
			.reverse()
			.find(
				(entry) =>
					entry.variant === 'progress' ||
					entry.operation === 'save' ||
					entry.operation === 'delete',
			) ?? list[list.length - 1]
	);
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
	const [entries, setEntries] = useState<Record<string, BusyEntry>>(
		initialBusy
			? {
					[DEFAULT_BUSY_SOURCE]: {
						label: null,
						variant: 'spinner',
						operation: null,
					},
				}
			: {},
	);

	const setBusy = useCallback((active: boolean, options?: BusyOptions) => {
		const source = options?.source ?? DEFAULT_BUSY_SOURCE;
		setEntries((prev) => {
			const next = { ...prev };
			if (active) {
				delete next[source];
				next[source] = {
					label: options?.label ?? null,
					variant: options?.variant ?? 'spinner',
					operation: options?.operation ?? null,
				};
			} else {
				delete next[source];
			}
			return next;
		});
	}, []);

	const current = pickBusyEntry(entries);
	const busy = current !== null;
	const label = current?.label ?? null;
	const variant = current?.variant ?? 'spinner';
	const operation = current?.operation ?? null;

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
