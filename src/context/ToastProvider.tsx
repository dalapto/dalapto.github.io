import { Alert, Snackbar } from '@mui/material';
import React, {
	createContext,
	ReactNode,
	useCallback,
	useContext,
	useState,
} from 'react';
import { logErrorDetails } from '../utils/getErrorMessage';

type ToastSeverity = 'success' | 'error';

interface ToastContextValue {
	showToast: (
		message: string,
		severity: ToastSeverity,
		error?: unknown,
	) => void;
}

type ToastState = {
	open: boolean;
	message: string;
	severity: ToastSeverity;
};

const ToastContext = createContext<ToastContextValue | null>(null);

function useToast() {
	const ctx = useContext(ToastContext);
	if (!ctx) throw new Error('useToast must be used within a ToastProvider');
	return ctx;
}

function ToastProvider({ children }: { children: ReactNode }) {
	const [toastKey, setToastKey] = useState(0);
	const [toast, setToast] = useState<ToastState>({
		open: false,
		message: '',
		severity: 'success',
	});

	const showToast = useCallback(
		(message: string, severity: ToastSeverity, error?: unknown) => {
			if (severity === 'error') {
				logErrorDetails(error ?? message, message);
			}
			setToastKey((key) => key + 1);
			setToast({ open: true, message, severity });
		},
		[],
	);

	const closeToast = useCallback(() => {
		setToast((prev) => ({ ...prev, open: false }));
	}, []);

	const handleClose = useCallback(
		(_event: React.SyntheticEvent | Event, reason?: string) => {
			if (reason === 'clickaway') return;
			closeToast();
		},
		[closeToast],
	);

	return (
		<ToastContext.Provider value={{ showToast }}>
			{children}
			<Snackbar
				key={toastKey}
				open={toast.open}
				autoHideDuration={6000}
				onClose={handleClose}
				anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
				sx={{
					zIndex: (theme) => theme.zIndex.modal + 200,
					top: { xs: '4.5rem', sm: '5rem' },
				}}
			>
				<Alert
					onClose={closeToast}
					severity={toast.severity}
					variant='filled'
					elevation={6}
					sx={{
						width: '100%',
						minWidth: '16rem',
						maxWidth: '36rem',
						boxShadow: 6,
					}}
				>
					{toast.message}
				</Alert>
			</Snackbar>
		</ToastContext.Provider>
	);
}

export { ToastProvider, useToast };
export type { ToastContextValue, ToastSeverity };
