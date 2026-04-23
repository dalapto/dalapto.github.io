import { SvgIconComponent } from '@mui/icons-material';
import HomeIcon from '@mui/icons-material/Home';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';
import * as React from 'react';
import { IconButtonLink } from '../../common/IconButton/IconButtonLink';
import { MenuPopper } from '../../common/MenuPopper/MenuPopper';
import { ToolbarList, ToolbarListItem } from '../ToolbarList/ToolbarList';
import './NavBar.css';

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

function NavBar({
	currentPage,
	toolbarItems,
	menuAnchor = null,
	menuItems = [],
	onMenuClose,
	externalLinks = [],
}: NavBarProps) {
	return (
		<AppBar id='navbar' position='static'>
			<Container maxWidth={false}>
				<Toolbar disableGutters>
					<Box id='navbar'>
						<Box sx={{ display: 'flex', mr: 3 }}>
							<IconButtonLink
								to='/'
								icon={HomeIcon}
								ariaLabel='Home'
								style={{ marginBlock: '8px', color: 'white' }}
							/>
						</Box>
					</Box>

					{/* Used for empty space on bar */}
					<Box sx={{ flexGrow: 0.75 }}> </Box>

					<ToolbarList items={toolbarItems} />

					{menuItems.length > 0 && onMenuClose && (
						<MenuPopper
							anchorElement={menuAnchor!}
							handleCloseMenu={onMenuClose}
							menuItems={menuItems}
						/>
					)}

					{externalLinks.map((link, index) => (
						<Box
							key={index}
							sx={{
								flexGrow: 0,
								display: 'flex',
								mr: index === 0 ? 2 : 1,
								justifyContent: '',
							}}
						>
							<IconButtonLink
								href={link.href}
								icon={link.icon}
								ariaLabel={link.href}
								style={{ color: 'white' }}
							/>
						</Box>
					))}
				</Toolbar>
			</Container>
		</AppBar>
	);
}

export { NavBar };
