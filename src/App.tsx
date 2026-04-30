import { animated, useTransition } from '@react-spring/web';
import React, { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router';
import './App.css';
import { PageInConstruction } from './components/display/PageInConstruction/PageInConstruction';
import { FooterBar } from './components/layout/FooterBar/FooterBar';
import { NavBar } from './components/layout/NavBar/NavBar';
import { navRoutes } from './constants/routes';

function App() {
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

export default App;
