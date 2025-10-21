import * as React from 'react';
import './NavBar.css';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import HomeIcon from '@mui/icons-material/Home';
import { SvgIconComponent } from '@mui/icons-material';
import IconButtonLink from '../../common/IconButton/IconButtonLink';
import NavBarHomeLogo from '../NavBarHomeLogo';
import ToolbarList, { ToolbarListItem } from '../../common/ToolbarList/ToolbarList';
import MenuPopper from '../../common/MenuPopper/MenuPopper';

export interface NavBarMenuItem {
	name: string;
	route: string;
}

export interface NavBarExternalLink {
	href: string;
	icon: SvgIconComponent;
}

interface NavBarProps {
	currentPage: string;
	toolbarItems: ToolbarListItem[];
	menuAnchor?: HTMLElement | null;
	menuItems?: NavBarMenuItem[];
	onMenuClose?: () => void;
	externalLinks?: NavBarExternalLink[];
}

function NavBar({ currentPage, toolbarItems, menuAnchor = null, menuItems = [], onMenuClose, externalLinks = [] }: NavBarProps) {
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

					{menuItems.length > 0 && onMenuClose && (
						<MenuPopper anchorElement={menuAnchor!} handleCloseMenu={onMenuClose} menuItems={menuItems} />
					)}

					{externalLinks.map((link, index) => (
						<Box key={index} sx={{ flexGrow: 0, display: 'flex', mr: index === 0 ? 2 : 1, justifyContent: '' }}>
							<IconButtonLink href={link.href} icon={link.icon} style={{ color: 'white' }} />
						</Box>
					))}
				</Toolbar>
			</Container>
		</AppBar>
	);
}

export default NavBar;
