import { animated, useTransition } from '@react-spring/web';
import React, { useEffect, useRef } from 'react';
import { Route, Routes, useLocation } from 'react-router';
import './App.css';
import { PageInConstruction } from './components/display/PageInConstruction/PageInConstruction';
import { FooterBar } from './components/layout/FooterBar/FooterBar';
import { NavBar } from './components/layout/NavBar/NavBar';
import { BackgroundProvider, useBackground } from './context/BackgroundContext';
import { AuthRequestProvider } from './context/AuthRequestContext';
import { GitHubProvider } from './context/GitHubContext';
import { SupabaseProvider } from './context/SupabaseContext';
import { ToastProvider } from './context/ToastProvider';
import { NavRoute, navRoutes } from './routes';
import { getRouteData } from './routes-data';

function flattenRoutes(routes: NavRoute[]): NavRoute[] {
	return routes.flatMap((r) => [r, ...flattenRoutes(r.children ?? [])]);
}

function AppBackground() {
	const { background } = useBackground();

	const transitions = useTransition(background, {
		keys: (bg) => bg?.image.src ?? 'none',
		from: { opacity: 0 },
		enter: (bg) => ({ opacity: bg ? 1 : 0 }),
		leave: { opacity: 0 },
		config: (bg) => ({
			duration: bg?.transitionDuration ?? 400,
		}),
	});

	return (
		<>
			{transitions((style, bg) =>
				bg ? (
					<animated.img
						className='app-background'
						src={bg.image.src}
						alt={bg.image.alt}
						style={{
							...style,
							objectFit: bg.imageFit ?? 'cover',
							objectPosition: bg.imagePosition ?? 'center top',
							filter: (bg.blur ?? 0) > 0 ? `blur(${bg.blur}px)` : undefined,
						}}
					/>
				) : null,
			)}
		</>
	);
}

function AppInner() {
	const location = useLocation();
	const currentPage = location.pathname;
	const currentPageSlice = currentPage.slice(1);
	const { setBackground } = useBackground();
	// Track the previous pathname so we can tell the difference between the
	// initial load (previousPage === null) and a real navigation (previousPage !== null).
	// Using a ref so it survives StrictMode double-invoke without being reset.
	const previousPage = useRef<string | null>(null);

	useEffect(() => {
		const routeData = getRouteData(currentPage);
		document.title =
			routeData?.ogTitle ??
			(currentPageSlice === '' ? 'dalapto | Welcome' : `${currentPageSlice} | dalapto.github.io`);
	}, [currentPage, currentPageSlice]);

	useEffect(() => {
		// Only freeze scroll observers when navigating away from a previous page.
		// On the initial load (previousPage === null) there is no outgoing page, so
		// we must NOT freeze — otherwise the IntersectionObserver callbacks that
		// fire shortly after mount would be blocked and the background would never appear.
		const isNavigation = previousPage.current !== null && previousPage.current !== currentPage;
		previousPage.current = currentPage;
		setBackground(null, { freezeObservers: isNavigation });
		window.scrollTo(0, 0);
	}, [currentPage, setBackground]);

	const transitions = useTransition(location, {
		keys: (loc) => loc.pathname,
		from: { opacity: 0, transform: 'translateX(50px)' },
		enter: { opacity: 1, transform: 'translateX(0px)' },
		leave: { opacity: 0, transform: 'translateX(-20px)' },
		config: (_item, _index, phase) => {
			if (phase === 'enter') return { duration: 900 };
			if (phase === 'leave') return { duration: 200 };
			return { duration: 0 };
		},
		exitBeforeEnter: true,
		delay: 500,
	});

	return (
		<div className='App'>
			<AppBackground />
			<NavBar currentPage={currentPage} navRoutes={navRoutes} />
			<div className='routes-container'>
				{transitions((style, loc) => (
					<animated.div style={style} className='page-transition-wrapper'>
						<Routes location={loc}>
							{flattenRoutes(navRoutes).map((r) => (
								<Route
									key={r.route}
									path={r.route}
									element={r.component ? r.component() : <PageInConstruction />}
								/>
							))}
						</Routes>
					</animated.div>
				))}
			</div>
			<FooterBar />
		</div>
	);
}

function App() {
	return (
		<BackgroundProvider>
			<SupabaseProvider>
				<GitHubProvider>
					<AuthRequestProvider>
						<ToastProvider>
							<AppInner />
						</ToastProvider>
					</AuthRequestProvider>
				</GitHubProvider>
			</SupabaseProvider>
		</BackgroundProvider>
	);
}

export default App;
