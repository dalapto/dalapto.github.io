import {
	createContext,
	ReactNode,
	useCallback,
	useContext,
	useEffect,
	useId,
	useMemo,
	useState,
} from 'react';
import { useBlocker } from 'react-router-dom';
import { ConfirmationModal } from '../components/layout/ConfirmationModal/ConfirmationModal';

type SetDirty = (id: string, label: string | null) => void;

const UnsavedChangesContext = createContext<SetDirty | null>(null);

/**
 * Tracks unsaved work across the app and guards against losing it:
 * - in-app navigation (links, navigate(), back/forward) → confirmation modal
 * - reload / tab close / typed URL → the browser's native "Leave site?" prompt
 *
 * Owns the app's single router blocker, so any number of components can
 * report dirty state via useUnsavedChanges().
 */
function UnsavedChangesProvider({ children }: { children: ReactNode }) {
	const [dirty, setDirtyMap] = useState<ReadonlyMap<string, string>>(
		() => new Map(),
	);

	const setDirty = useCallback<SetDirty>((id, label) => {
		setDirtyMap((prev) => {
			if (label === null ? !prev.has(id) : prev.get(id) === label) {
				return prev;
			}
			const next = new Map(prev);
			if (label === null) next.delete(id);
			else next.set(id, label);
			return next;
		});
	}, []);

	const hasUnsaved = dirty.size > 0;

	const blocker = useBlocker(
		({ currentLocation, nextLocation }) =>
			hasUnsaved && currentLocation.pathname !== nextLocation.pathname,
	);

	useEffect(() => {
		if (!hasUnsaved) return;
		const handleBeforeUnload = (event: BeforeUnloadEvent) => {
			event.preventDefault();
			// Required for Chrome/Edge to show the prompt.
			event.returnValue = '';
		};
		window.addEventListener('beforeunload', handleBeforeUnload);
		return () => window.removeEventListener('beforeunload', handleBeforeUnload);
	}, [hasUnsaved]);

	const labels = useMemo(() => [...new Set(dirty.values())], [dirty]);

	return (
		<UnsavedChangesContext.Provider value={setDirty}>
			{children}
			<ConfirmationModal
				open={blocker.state === 'blocked'}
				onClose={() => blocker.reset?.()}
				onConfirm={() => blocker.proceed?.()}
				title='Leave without saving?'
				message={
					<>
						You have unsaved changes in <strong>{labels.join(', ')}</strong>.
						They will be lost if you leave this page.
					</>
				}
				confirmLabel='Leave'
				cancelLabel='Stay'
				danger
			/>
		</UnsavedChangesContext.Provider>
	);
}

/** Report whether this component has unsaved work, labelled for the leave prompt. */
function useUnsavedChanges(isDirty: boolean, label: string) {
	const setDirty = useContext(UnsavedChangesContext);
	if (!setDirty) {
		throw new Error(
			'useUnsavedChanges must be used within an UnsavedChangesProvider',
		);
	}
	const id = useId();

	useEffect(() => {
		setDirty(id, isDirty ? label : null);
	}, [setDirty, id, isDirty, label]);

	useEffect(() => () => setDirty(id, null), [setDirty, id]);
}

export { UnsavedChangesProvider, useUnsavedChanges };
