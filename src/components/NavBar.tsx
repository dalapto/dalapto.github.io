import * as React from 'react';
import './NavBar.css';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import HomeIcon from '@mui/icons-material/Home';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import { Link, useLocation } from 'react-router-dom';
import Popper from '@mui/material/Popper';
import Fade from '@mui/material/Fade';

const projects = [
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
						<Link style={{ textDecoration: 'none', color: 'white' }} to={`/`}>
							<HomeIcon sx={{ display: { xs: 'flex', md: 'flex' }, mr: 3 }} />
						</Link>
						<Typography
							variant="h5"
							noWrap
							component="p"
							id={currentPage === '/' ? 'home-text-selected' : 'home-text'}
							sx={{
								mr: 2,
								display: { xs: 'flex', md: 'flex' },
								flexGrow: 1,
								fontSize: '1.5rem',
								fontFamily: 'monospace',
								fontWeight: 700,
								letterSpacing: '.3rem',
								color: 'inherit',
								textDecoration: 'none',
							}}
						>
							<Link style={{ textDecoration: 'none', color: 'white' }} to={`/`}>
								HOME
							</Link>
						</Typography>
					</Box>

					{/* Used for empty space on bar */}
					<Box sx={{ flexGrow: 0.75 }}> </Box>

					{/* //burger menu for mobile instead of navbar */}
					<Box sx={{ display: { xs: 'flex', md: 'none' } }}>
						<IconButton size="large" aria-controls="menu-appbar" aria-haspopup="true" onClick={handleOpenNavMenu} color="inherit">
							<MenuIcon />
						</IconButton>
						<Menu
							id="menu-appbar"
							anchorEl={anchorElNav}
							anchorOrigin={{
								vertical: 'bottom',
								horizontal: 'left',
							}}
							keepMounted
							transformOrigin={{
								vertical: 'top',
								horizontal: 'left',
							}}
							open={Boolean(anchorElNav)}
							onClose={handleCloseNavMenu}
							sx={{
								display: { xs: 'block', md: 'none' },
							}}
						>
							{pages.map((page) => (
								<MenuItem key={page} onClick={handleCloseNavMenu}>
									<Link style={{ textDecoration: 'none', color: 'black' }} to={`/${page}`}>
										{page}
									</Link>
								</MenuItem>
							))}
						</Menu>
					</Box>

					{/* pages as normal */}
					<Box
						sx={{
							flexGrow: 0.25,
							display: {
								justifyContent: 'space-around',
								xs: 'none',
								md: 'flex',
							},
						}}
					>
						{pages.map((page) => (
							<Button
								id={'/' + page === currentPage ? `navbar-button-selected` : `navbar-button`}
								key={page}
								onMouseEnter={page === 'Projects' ? handleOpenProjectsMenu : handleCloseProjectsMenu}
								onClick={page === 'Projects' ? handleOpenProjectsMenu : handleCloseProjectsMenu}
								sx={{ my: 2, color: 'white', display: 'block' }}
							>
								<Typography
									textAlign="center"
									sx={{
										textTransform: 'capitalize',
										fontFamily: 'arial',
										fontSize: '1.2rem',
									}}
								>
									<Link style={{ textDecoration: 'none', color: 'white' }} to={`/${page}`}>
										{page}
									</Link>
								</Typography>
							</Button>
						))}
					</Box>

					<Box sx={{ flexGrow: 0, display: 'flex', mr: 2 }}>
						<a href="https://www.linkedin.com/in/david-mcalister/" target="_blank" rel="noopener noreferrer">
							<IconButton>
								{/* issues getting this to look 100% like normal icon, left for now */}
								<LinkedInIcon sx={{ color: 'white' }} />
								{/* could also move to a bottom navbar with a white bg instead, which would avert issue */}
							</IconButton>
						</a>
					</Box>
					<Box sx={{ flexGrow: 0, display: 'flex', mr: 1, justifyContent: '' }}>
						<a href="https://github.com/dalapto/dalapto.github.io" target="_blank" rel="noopener noreferrer">
							<IconButton>
								<GitHubIcon sx={{ color: 'white' }} />
							</IconButton>
						</a>
					</Box>
					<Popper
						id="menu-appbar"
						anchorEl={anchorElProjects}
						placement="bottom"
						modifiers={[
							{
								name: 'offset',
								enabled: true,
								options: {
									offset: [0, 10],
								},
							},
							{
								name: 'flip',
								enabled: false,
								options: {
									altBoundary: false,
									rootBoundary: 'document',
									padding: 20,
								},
							},
							{
								name: 'preventOverflow',
								enabled: true,
								options: {
									altAxis: true,
									altBoundary: true,
									tether: true,
									rootBoundary: 'document',
									padding: 20,
								},
							},
							{
								name: 'arrow',
								enabled: false,
							},
						]}
						transition
						open={Boolean(anchorElProjects)}
						onMouseLeave={handleCloseProjectsMenu}
					>
						{({ TransitionProps }) => (
							<Fade {...TransitionProps} timeout={300}>
								<Box>
									{projects.map((project) => (
										<MenuItem key={project.route} component={Link} to={`/${project.route}`}>
											<Typography id="menu-appbar-item" textAlign="center" color={'white'} onClick={handleCloseProjectsMenu}>
												{project.name}
											</Typography>
										</MenuItem>
									))}
								</Box>
							</Fade>
						)}
					</Popper>
				</Toolbar>
			</Container>
		</AppBar>
	);
}
export default NavBar;
