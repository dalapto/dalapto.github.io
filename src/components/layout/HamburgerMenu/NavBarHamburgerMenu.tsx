import * as React from 'react';
import '../../layout/NavBar/NavBar.css';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Link } from 'react-router-dom';

interface HamburgerMenuProps {
	anchorElement: Element | HTMLElement;
	handleOpenMenu: () => void;
	handleCloseMenu: () => void;
	menuItems: string[]; // TODO define object type
}

function HamburgerMenu({ anchorElement, handleOpenMenu, handleCloseMenu, menuItems, ...delegated }: HamburgerMenuProps) {
	return (
		<>
			<IconButton size="large" aria-controls="menu-appbar" aria-haspopup="true" onClick={() => handleOpenMenu()} color="inherit">
				<MenuIcon />
			</IconButton>
			<Menu
				{...delegated}
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
export { HamburgerMenu };
