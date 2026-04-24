import { SvgIconComponent } from '@mui/icons-material';
import HomeIcon from '@mui/icons-material/Home';
import MenuIcon from '@mui/icons-material/Menu';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import * as React from 'react';
import { useCallback, useMemo } from 'react';
import { NavRoute } from '../../../constants/routes';
import { IconButtonLink } from '../../common/IconButton/IconButtonLink';
import { MenuPopper } from '../../common/MenuPopper/MenuPopper';
import { ToolbarItemList } from '../ToolbarList/ToolbarList';
import './NavBar.css';
interface NavItem {
	name: string;
	route: string;
}

interface NavBarExternalLink {
	href: string;
	icon: SvgIconComponent;
}

interface NavBarProps {
	currentPage: string;
	navRoutes: NavRoute[];
	externalLinks?: NavBarExternalLink[];
}

function NavBar({ currentPage, navRoutes, externalLinks = [] }: NavBarProps) {
	const [isMenuOpen, setIsMenuOpen] = React.useState(false);
	const [menuAnchor, setMenuAnchor] = React.useState<HTMLElement | null>(null);
	const [menuItems, setMenuItems] = React.useState<NavRoute[]>([]);

	const closeMenu = () => {
		setIsMenuOpen(false);
		setMenuAnchor(null);
	};

	const openMenu = useCallback(
		(
			event: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>,
			children: NavRoute[],
		) => {
			const isKeyboardEvent = 'key' in event;
			const spaceOrEnterKey =
				isKeyboardEvent && (event.key === ' ' || event.key === 'Enter');

			if (!isKeyboardEvent || spaceOrEnterKey) {
				setMenuAnchor(event.currentTarget as HTMLElement);
				setMenuItems(children);
				setIsMenuOpen(true);
			}
		},
		[],
	);

	const toolbarItems = useMemo(() => {
		return navRoutes
			.filter((r) => r.label)
			.map((r) => ({
				label: r.label!,
				route: r.children ? undefined : r.route,
				isActive: r.route === currentPage,
				onMouseEnter: r.children
					? (e) => openMenu(e, r.children!)
					: r.onMouseEnter,
				onClick: r.children ? (e) => openMenu(e, r.children!) : r.onClick,
				onKeyDown: r.children ? (e) => openMenu(e, r.children!) : r.onKeyDown,
				ariaHasPopup: r.children ? true : undefined,
				ariaExpanded: r.children ? Boolean(menuAnchor) : undefined,
			}));
	}, [currentPage, menuAnchor, navRoutes, openMenu]) as NavRoute[];

	const hamburgerItems = useMemo(() => {
		return navRoutes.map((r) => ({
			label: r.label! ?? 'Home',
			route: r.route,
			isActive: r.route === currentPage,
		}));
	}, [currentPage, navRoutes]) as NavRoute[];

	console.log('toolbarItems', toolbarItems);
	console.log('hamburgerItems', hamburgerItems);

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

					<ToolbarItemList items={toolbarItems} />

					{menuItems.length > 0 && isMenuOpen && (
						<MenuPopper
							anchorElement={menuAnchor!}
							handleCloseMenu={closeMenu}
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

					<IconButton
						size='large'
						aria-controls='menu-appbar'
						aria-haspopup='true'
						aria-label='Menu'
						onClick={(e) => openMenu(e, hamburgerItems)}
						color='inherit'
						sx={{ display: { xs: 'flex-end', md: 'none' } }}
					>
						<MenuIcon />
					</IconButton>
				</Toolbar>
			</Container>
		</AppBar>
	);
}

export { NavBar, NavBarExternalLink, NavItem };
