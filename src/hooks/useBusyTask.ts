import { useCallback } from 'react';
import { type BusyOptions, useBusy } from '../context/BusyContext';
import { type ToastContextValue, ToastSeverity } from '../context/ToastProvider';
import { getErrorMessage } from '../utils/getErrorMessage';

/**
 * Runs an async task with the busy overlay shown, and turns any error into an
 * error toast. Replaces the repeated setBusy / try / catch / finally blocks.
 */
function useBusyTask(showToast: ToastContextValue['showToast']) {
	const { setBusy } = useBusy();

	return useCallback(
		async (options: BusyOptions, task: () => Promise<void>) => {
			setBusy(true, options);
			try {
				await task();
			} catch (error) {
				showToast(getErrorMessage(error), ToastSeverity.ERROR, error);
			} finally {
				setBusy(false);
			}
		},
		[setBusy, showToast],
	);
}

export { useBusyTask };
