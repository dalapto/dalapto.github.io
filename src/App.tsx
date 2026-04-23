import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import React, { useEffect, useMemo } from 'react';
import { Route, Routes, useLocation } from 'react-router';
import './App.css';
import { Temp } from './components/common/Temp/Temp';
import { FooterBar } from './components/layout/FooterBar/FooterBar';
import {
	NavBar,
	NavBarExternalLink,
} from './components/layout/NavBar/NavBar';
import { externalLinks as externalLinksConstants } from './constants/constants';
import { navRoutes } from './constants/routes';

const externalLinks: NavBarExternalLink[] = [
	{ href: externalLinksConstants.linkedin, icon: LinkedInIcon },
	{ href: externalLinksConstants.github, icon: GitHubIcon },
];

// const projectMenuItems: NavBarMenuItem[] = navRoutes
// 	.filter((r) => r.parent === 'Projects')
// 	.map((r) => ({ name: r.label!, route: r.path }));

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
			<NavBar
				currentPage={currentPage}
				navRoutes={navRoutes}
				externalLinks={externalLinks}
			/>
			<div className='routes-container'>
				<Routes>
					{navRoutes.map((r) => (
						<Route
							key={r.path}
							path={r.path}
							element={r.component ? r.component() : <Temp />}
						/>
					))}
				</Routes>
			</div>
			<FooterBar />
		</div>
	);
}

export default App;
