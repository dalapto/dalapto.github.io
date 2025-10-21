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
import { Link } from 'react-router-dom';

interface NavBarHomeLogoProps {
	currentPage: string;
}

function NavBarHomeLogo({ currentPage = '/', ...delegated }: NavBarHomeLogoProps) {
	return (
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
			{...delegated}
		>
			<Link style={{ textDecoration: 'none', color: 'white' }} to={`/`} {...delegated}>
				HOME
			</Link>
		</Typography>
	);
}
export default NavBarHomeLogo;
