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
	NavBarMenuItem,
} from './components/layout/NavBar/NavBar';
import { ToolbarListItem } from './components/layout/ToolbarList/ToolbarList';
import { externalLinks as externalLinksConstants } from './constants/constants';
import { navRoutes } from './constants/routes';

const externalLinks: NavBarExternalLink[] = [
	{ href: externalLinksConstants.linkedin, icon: LinkedInIcon },
	{ href: externalLinksConstants.github, icon: GitHubIcon },
];

const projectMenuItems: NavBarMenuItem[] = navRoutes
	.filter((r) => r.parent === 'Projects')
	.map((r) => ({ name: r.label!, route: r.path }));

function App() {
	const currentPage = useLocation().pathname;
	const currentPageSlice = currentPage.slice(1);
	const [menuAnchor, setMenuAnchor] = React.useState<HTMLElement | null>(null);

	useEffect(() => {
		document.title = `${
			currentPageSlice == ''
				? 'dalapto | Welcome'
				: `${currentPageSlice} | dalapto.github.io`
		}`;
	}, [currentPageSlice]);

	const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
		setMenuAnchor(event.currentTarget);
	};

	const handleCloseMenu = () => {
		setMenuAnchor(null);
	};

	const handleProjectsKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
		if (event.key === ' ' || event.key === 'Enter') {
			event.preventDefault();
			setMenuAnchor(event.currentTarget as HTMLElement);
		}
	};

	const toolbarItems: ToolbarListItem[] = useMemo(
		() =>
			navRoutes
				.filter((r) => !r.parent && r.label)
				.map((r) => ({
					label: r.label!,
					route: r.path,
					isActive: r.path === currentPage,
					onMouseEnter: r.label === 'Projects' ? handleOpenMenu : undefined,
					onClick: r.label === 'Projects' ? handleOpenMenu : handleCloseMenu,
					onKeyDown: r.label === 'Projects' ? handleProjectsKeyDown : undefined,
					ariaHasPopup: r.label === 'Projects' ? true : undefined,
					ariaExpanded:
						r.label === 'Projects' ? Boolean(menuAnchor) : undefined,
				})),
		[currentPage, menuAnchor],
	);

	return (
		<div className='App'>
			<NavBar
				currentPage={currentPage}
				toolbarItems={toolbarItems}
				menuAnchor={menuAnchor}
				menuItems={projectMenuItems}
				onMenuClose={handleCloseMenu}
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
