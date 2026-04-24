import React, { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router';
import './App.css';
import { PageInConstruction } from './components/display/PageInConstruction/PageInConstruction';
import { FooterBar } from './components/layout/FooterBar/FooterBar';
import { NavBar } from './components/layout/NavBar/NavBar';
import { navRoutes } from './constants/routes';

function App() {
	const currentPage = useLocation().pathname;
	const currentPageSlice = currentPage.slice(1);

	useEffect(() => {
		document.title = `${
			currentPageSlice == ''
				? 'dalapto | Welcome'
				: `${currentPageSlice} | dalapto.github.io`
		}`;
	}, [currentPageSlice]);

	return (
		<div className='App'>
			<NavBar currentPage={currentPage} navRoutes={navRoutes} />
			<div className='routes-container'>
				<Routes>
					{navRoutes.map((r) => (
						<Route
							key={r.route}
							path={r.route}
							element={r.component ? r.component() : <PageInConstruction />}
						/>
					))}
				</Routes>
			</div>
			<FooterBar />
		</div>
	);
}

export default App;
