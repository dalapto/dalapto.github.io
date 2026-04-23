import MenuIcon from '@mui/icons-material/Menu';
import IconButton from '@mui/material/IconButton';
import * as React from 'react';
import { MenuPopper } from '../../common/MenuPopper/MenuPopper';
import '../../layout/NavBar/NavBar.css';
import { NavRoute } from '../../../constants/routes';

interface HamburgerMenuProps {
	anchorElement: Element | HTMLElement;
	handleOpenMenu: (event: React.MouseEvent<HTMLElement>) => void;
	handleCloseMenu: () => void;
	menuItems: NavRoute[];
}

function HamburgerMenu({
	anchorElement,
	handleOpenMenu,
	menuItems,
	...delegated
}: HamburgerMenuProps) {
	return (
		<>
			<IconButton
				size='large'
				aria-controls='menu-appbar'
				aria-haspopup='true'
				onClick={handleOpenMenu}
				color='inherit'
			>
				<MenuIcon />
			</IconButton>
		</>
	);
}
export { HamburgerMenu };
