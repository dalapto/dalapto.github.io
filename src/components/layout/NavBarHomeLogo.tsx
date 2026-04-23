import Typography from '@mui/material/Typography';
import * as React from 'react';
import { Link } from 'react-router-dom';
import '../layout/NavBar/NavBar.css';

interface NavBarHomeLogoProps {
	currentPage: string;
}

function NavBarHomeLogo({
	currentPage = '/',
	...delegated
}: NavBarHomeLogoProps) {
	return (
		<Typography
			variant='h5'
			noWrap
			component='p'
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
			<Link
				style={{ textDecoration: 'none', color: 'white' }}
				to={`/`}
				{...delegated}
			>
				HOME
			</Link>
		</Typography>
	);
}
export { NavBarHomeLogo };
