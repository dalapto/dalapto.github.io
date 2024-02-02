import * as React from 'react';
import './NavBar.css';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import MenuItem from '@mui/material/MenuItem';
import HomeIcon from '@mui/icons-material/Home';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import { Link, useLocation } from 'react-router-dom';
import Popper from '@mui/material/Popper';
import Fade from '@mui/material/Fade';
import { externalLinks } from '../constants';
import NavBarIconButton from './NavBarIconButton';
import NavBarHomeLogo from './NavBarHomeLogo';
import NavBarHamburgerMenu from './NavBarMenu';
import NavBarMenu from './NavBarMenu';
import NavBarMenuPopper from './NavBarMenuPopper';

const projects = [
	{ name: 'Jack Change It', route: 'jack-change-it' },
	{ name: 'VueJS Face Labeller', route: 'vue' },
	{ name: 'Modding: Rise of Nations - WW2', route: 'ron' },
	{ name: 'Modding: M2TW - Early to Late', route: 'm2tw' },
];
const pages = ['About', 'Projects', 'Blog'];

function NavBar() {
	const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
	const [anchorElProjects, setAnchorElProjects] = React.useState<null | HTMLElement>(null);

	const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorElNav(event.currentTarget);
	};
	const handleOpenProjectsMenu = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorElProjects(event.currentTarget);
	};

	const handleCloseNavMenu = () => {
		setAnchorElNav(null);
	};

	const handleCloseProjectsMenu = () => {
		setAnchorElProjects(null);
	};

	const currentPage = useLocation().pathname;

	return (
		<AppBar id="navbar" position="static">
			<Container maxWidth={false}>
				<Toolbar disableGutters>
					<Box id="navbar">
						<Box sx={{ display: 'flex', mr: 3 }}>
							<NavBarIconButton as={'a'} destination={'/'} icon={HomeIcon} style={{ marginBlock: '8px', color: 'white' }} />
						</Box>
						<NavBarHomeLogo currentPage={currentPage} />
					</Box>

					{/* Used for empty space on bar */}
					<Box sx={{ flexGrow: 0.75 }}> </Box>

					<NavBarMenu
						anchorElement={anchorElNav!}
						currentPage={currentPage}
						handleOpenMenu={handleOpenProjectsMenu}
						handleCloseMenu={handleCloseProjectsMenu}
						menuItems={pages}
					/>

					<NavBarMenuPopper anchorElement={anchorElProjects!} handleOpenMenu={handleOpenProjectsMenu} handleCloseMenu={handleCloseProjectsMenu} menuItems={projects} />
					<Box sx={{ flexGrow: 0, display: 'flex', mr: 2, justifyContent: '' }}>
						<NavBarIconButton as={'a'} icon={LinkedInIcon} style={{ color: 'white' }} destination={externalLinks.linkedin} />
					</Box>
					<Box sx={{ flexGrow: 0, display: 'flex', mr: 1, justifyContent: '' }}>
						<NavBarIconButton as={'a'} icon={GitHubIcon} style={{ color: 'white' }} destination={externalLinks.github} />
					</Box>
				</Toolbar>
			</Container>
		</AppBar>
	);
}
export default NavBar;
