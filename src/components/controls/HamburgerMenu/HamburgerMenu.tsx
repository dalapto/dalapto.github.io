import MenuIcon from '@mui/icons-material/Menu';
import IconButton from '@mui/material/IconButton';
import * as React from 'react';
import './HamburgerMenu.css';
import '../../layout/NavBar/NavBar.css';

interface HamburgerMenuProps {
	handleOpenMenu: (event: React.MouseEvent<HTMLElement>) => void;
}

function HamburgerMenu({ handleOpenMenu }: HamburgerMenuProps) {
	return (
		<IconButton
			size='large'
			aria-controls='menu-appbar'
			aria-haspopup='true'
			aria-label='Menu'
			onClick={handleOpenMenu}
			color='inherit'
			className='hamburger-menu'
			sx={{ display: { xs: 'flex-end', md: 'none' } }}
		>
			<MenuIcon />
		</IconButton>
	);
}
export { HamburgerMenu };
