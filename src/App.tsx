import NavBar from './components/layout/NavBar/NavBar';
import Home from './pages/Home/Home';
import About from './pages/About/About';
import Projects from './pages/Projects/Projects';
import Blog from './pages/Blog/Blog';
import Ron from './pages/Projects/Ron/Ron';
import Etl from './pages/Projects/ETL/Etl';
import './App.css';
import { Route, Routes, useLocation } from 'react-router';
import React, { useEffect, useMemo } from 'react';
import { ToolbarListItem } from './components/common/ToolbarList/ToolbarList';
import { NavBarExternalLink, NavBarMenuItem } from './components/layout/NavBar/NavBar';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import { externalLinks as externalLinksConstants } from './constants/constants';

// Project menu items for dropdown
const projectMenuItems: NavBarMenuItem[] = [
	{ name: 'Jack Change It', route: 'jack-change-it/' },
	{ name: 'VueJS Face Labeller', route: 'vue' },
	{ name: 'Modding: Rise of Nations - WW2', route: 'ron' },
	{ name: 'Modding: M2TW - Early to Late', route: 'm2tw' },
];

// External social links
const externalLinks: NavBarExternalLink[] = [
	{ href: externalLinksConstants.linkedin, icon: LinkedInIcon },
	{ href: externalLinksConstants.github, icon: GitHubIcon },
];

function App() {
	const currentPage = useLocation().pathname;
	const currentPageSlice = currentPage.slice(1);
	const [menuAnchor, setMenuAnchor] = React.useState<HTMLElement | null>(null);

	useEffect(() => {
		document.title = `${currentPageSlice == '' ? 'dalapto | Welcome' : `${currentPageSlice} | dalapto.github.io`}`;
	}, [currentPageSlice]);

	const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
		setMenuAnchor(event.currentTarget);
	};

	const handleCloseMenu = () => {
		setMenuAnchor(null);
	};

	// Define toolbar navigation items
	const toolbarItems: ToolbarListItem[] = useMemo(
		() => [
			{
				label: 'About',
				route: '/About',
				isActive: '/About' === currentPage,
				onClick: handleCloseMenu,
			},
			{
				label: 'Projects',
				route: '/Projects',
				isActive: '/Projects' === currentPage,
				onMouseEnter: handleOpenMenu,
				onClick: handleOpenMenu,
			},
			{
				label: 'Blog',
				route: '/Blog',
				isActive: '/Blog' === currentPage,
				onClick: handleCloseMenu,
			},
		],
		[currentPage]
	);

	return (
		<div className="App">
			<NavBar
				currentPage={currentPage}
				toolbarItems={toolbarItems}
				menuAnchor={menuAnchor}
				menuItems={projectMenuItems}
				onMenuClose={handleCloseMenu}
				externalLinks={externalLinks}
			/>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="About" element={<About />} />
				<Route path="Projects" element={<Projects />} />
				<Route path="Blog" element={<Blog />} />
				<Route path="m2tw" element={<Etl />} />
				<Route path="ron" element={<Ron />} />
				<Route path="vue" element={<About />} />
			</Routes>
		</div>
	);
}

export default App;
