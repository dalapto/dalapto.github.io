import * as React from 'react';
import './NavBar.css';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Link } from 'react-router-dom';
import { Box } from '@mui/material';

interface NavBarHamburgerMenuProps {
	anchorElement: Element | HTMLElement;
	handleOpenMenu: Function;
	handleCloseMenu: Function;
	menuItems: string[]; // TODO define object type
}

function NavBarHamburgerMenu({ anchorElement, handleOpenMenu, handleCloseMenu, menuItems, ...delegated }: NavBarHamburgerMenuProps) {
	return (
		<>
			<IconButton size="large" aria-controls="menu-appbar" aria-haspopup="true" onClick={() => handleOpenMenu()} color="inherit">
				<MenuIcon />
			</IconButton>
			<Menu
				id="menu-appbar"
				anchorEl={anchorElement}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'left',
				}}
				keepMounted
				transformOrigin={{
					vertical: 'top',
					horizontal: 'left',
				}}
				open={Boolean(anchorElement)}
				onClose={() => handleCloseMenu()}
				sx={{
					display: { xs: 'block', md: 'none' },
				}}
			>
				{menuItems.map((item) => (
					<MenuItem key={item} onClick={() => handleCloseMenu()}>
						<Link style={{ textDecoration: 'none', color: 'black' }} to={`/${item}`}>
							{item}
						</Link>
					</MenuItem>
				))}
			</Menu>
		</>
	);
}
export default NavBarHamburgerMenu;
