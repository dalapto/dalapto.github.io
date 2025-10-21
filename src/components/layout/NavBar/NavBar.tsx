import * as React from 'react';
import './NavBar.css';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import HomeIcon from '@mui/icons-material/Home';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import { useLocation } from 'react-router-dom';
import { externalLinks } from '../../../constants/constants';
import IconButtonLink from '../../common/IconButton/IconButtonLink';
import NavBarHomeLogo from '../NavBarHomeLogo';
import ToolbarList, { ToolbarListItem } from '../../common/ToolbarList/ToolbarList';
import MenuPopper from '../../common/MenuPopper/MenuPopper';

const projects = [
	{ name: 'Jack Change It', route: 'jack-change-it/' },
	{ name: 'VueJS Face Labeller', route: 'vue' },
	{ name: 'Modding: Rise of Nations - WW2', route: 'ron' },
	{ name: 'Modding: M2TW - Early to Late', route: 'm2tw' },
];

function NavBar() {
	const [anchorElProjects, setAnchorElProjects] = React.useState<null | HTMLElement>(null);

	const handleOpenProjectsMenu = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorElProjects(event.currentTarget);
	};

	const handleCloseProjectsMenu = () => {
		setAnchorElProjects(null);
	};

	const currentPage = useLocation().pathname;

	const toolbarItems: ToolbarListItem[] = [
		{
			label: 'About',
			route: '/About',
			isActive: '/About' === currentPage,
			onClick: handleCloseProjectsMenu,
		},
		{
			label: 'Projects',
			route: '/Projects',
			isActive: '/Projects' === currentPage,
			onMouseEnter: handleOpenProjectsMenu,
			onClick: handleOpenProjectsMenu,
		},
		{
			label: 'Blog',
			route: '/Blog',
			isActive: '/Blog' === currentPage,
			onClick: handleCloseProjectsMenu,
		},
	];

	return (
		<AppBar id="navbar" position="static">
			<Container maxWidth={false}>
				<Toolbar disableGutters>
				<Box id="navbar">
					<Box sx={{ display: 'flex', mr: 3 }}>
						<IconButtonLink to="/" icon={HomeIcon} style={{ marginBlock: '8px', color: 'white' }} />
					</Box>
					<NavBarHomeLogo currentPage={currentPage} />
				</Box>

				{/* Used for empty space on bar */}
				<Box sx={{ flexGrow: 0.75 }}> </Box>

				<ToolbarList items={toolbarItems} />

				<MenuPopper anchorElement={anchorElProjects!} handleCloseMenu={handleCloseProjectsMenu} menuItems={projects} />
				<Box sx={{ flexGrow: 0, display: 'flex', mr: 2, justifyContent: '' }}>
					<IconButtonLink href={externalLinks.linkedin} icon={LinkedInIcon} style={{ color: 'white' }} />
				</Box>
				<Box sx={{ flexGrow: 0, display: 'flex', mr: 1, justifyContent: '' }}>
					<IconButtonLink href={externalLinks.github} icon={GitHubIcon} style={{ color: 'white' }} />
				</Box>
				</Toolbar>
			</Container>
		</AppBar>
	);
}
export default NavBar;
