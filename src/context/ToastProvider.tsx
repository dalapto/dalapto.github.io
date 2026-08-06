import { Alert, Snackbar } from '@mui/material';
import React, {
	createContext,
	ReactNode,
	useCallback,
	useContext,
	useMemo,
	useState,
} from 'react';
import { colours } from '../constants/colours';
import { logErrorDetails } from '../utils/getErrorMessage';

enum ToastSeverity {
	SUCCESS = 'success',
	ERROR = 'error',
	WARNING = 'warning',
	INFO = 'info',
}

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
		severity: ToastSeverity.SUCCESS,
	});

	const showToast = useCallback(
		(message: string, severity: ToastSeverity, error?: unknown) => {
			if (severity === ToastSeverity.ERROR) {
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
	const backgroundColor = useMemo(() => {
		switch (toast.severity) {
			case ToastSeverity.ERROR:
				return colours.danger;
			case ToastSeverity.WARNING:
				return colours.warning;
			case ToastSeverity.INFO:
				return colours.info;
			case ToastSeverity.SUCCESS:
				return colours.success;
			default:
				return colours.secondary;
		}
	}, [toast.severity]);

	return (
		<ToastContext.Provider value={{ showToast }}>
			{children}
			<Snackbar
				key={toastKey}
				open={toast.open}
				autoHideDuration={5000}
				onClose={handleClose}
				anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
				sx={{
					zIndex: (theme) => theme.zIndex.modal + 200,
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
						backgroundColor,
						color: colours.primary,
					}}
				>
					{toast.message}
				</Alert>
			</Snackbar>
		</ToastContext.Provider>
	);
}

export { ToastProvider, useToast, ToastSeverity, type ToastContextValue };
