import MenuIcon from '@mui/icons-material/Menu';
import IconButton from '@mui/material/IconButton';
import * as React from 'react';
import '../../layout/NavBar/NavBar.css';
import './HamburgerMenu.css';

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
			sx={{ display: { xs: 'flex-end', md: 'none' }, ml: 'auto' }}
		>
			<MenuIcon />
		</IconButton>
	);
}
export { HamburgerMenu };
