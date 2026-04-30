import { animated, useSpring, useTransition } from '@react-spring/web';
import React, { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router';
import './App.css';
import { PageInConstruction } from './components/display/PageInConstruction/PageInConstruction';
import { FooterBar } from './components/layout/FooterBar/FooterBar';
import { NavBar } from './components/layout/NavBar/NavBar';
import { navRoutes } from './constants/routes';
import { BackgroundProvider, useBackground } from './contexts/BackgroundContext';

function AppBackground() {
	const { background } = useBackground();
	// Keep the last known config so we can fade out instead of snapping to null.
	const lastBackground = React.useRef(background);
	if (background) lastBackground.current = background;
	const displayed = background ?? lastBackground.current;

	const fade = useSpring({
		opacity: background ? 1 : 0,
		config: { duration: 500 },
	});

	if (!displayed) return null;
	return (
		<animated.img
			className='app-background'
			src={displayed.image.src}
			alt={displayed.image.alt}
			style={{
				...fade,
				objectPosition: displayed.imagePosition ?? 'center top',
				filter: (displayed.blur ?? 0) > 0 ? `blur(${displayed.blur}px)` : undefined,
			}}
		/>
	);
}

function AppInner() {
	const location = useLocation();
	const currentPage = location.pathname;
	const currentPageSlice = currentPage.slice(1);

	useEffect(() => {
		document.title = `${
			currentPageSlice == ''
				? 'dalapto | Welcome'
				: `${currentPageSlice} | dalapto.github.io`
		}`;
	}, [currentPageSlice]);

	useEffect(() => {
		window.scrollTo(0, 0);
	}, [currentPage]);

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
							{navRoutes.map((r) => (
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
			<AppInner />
		</BackgroundProvider>
	);
}

export default App;
