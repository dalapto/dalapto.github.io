import { ThemeProvider } from '@mui/material/styles';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App.js';
import { RouteErrorFallback } from './components/display/ErrorBoundary/ErrorBoundary';
import './index.css';
import { applyTokens } from './styles/applyTokens';
import { theme } from './styles/theme';
import { installGlobalErrorHandlers } from './utils/global-error-handlers';

installGlobalErrorHandlers();
applyTokens();

// Data router (needed for useBlocker). App keeps its own <Routes>, rendered
// as descendant routes beneath this single splat route.
const router = createBrowserRouter([
	{ path: '*', element: <App />, errorElement: <RouteErrorFallback /> },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<ThemeProvider theme={theme}>
			<RouterProvider router={router} />
		</ThemeProvider>
	</React.StrictMode>
);
