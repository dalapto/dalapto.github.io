import { EditNote } from '@mui/icons-material';
import AssignmentOutlined from '@mui/icons-material/AssignmentOutlined';
import HomeIcon from '@mui/icons-material/Home';
import AssignmentIndOutlined from '@mui/icons-material/AssignmentIndOutlined';
import { useMediaQuery } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { SxProps, Theme, useTheme } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import * as React from 'react';
import { useCallback, useMemo } from 'react';
import { colours } from '../../../constants/colours';
import { externalLinks } from '../../../constants/link-constants';
import { useAuthRequest } from '../../../context/AuthRequestContext';
import { useGitHub } from '../../../context/GitHubContext';
import { useSupabase } from '../../../context/SupabaseContext';
import { NavRoute } from '../../../routes';
import { AuthIconButton } from '../../auth/AuthIconButton';
import { HamburgerMenu } from '../../controls/HamburgerMenu/HamburgerMenu';
import { IconButtonLink } from '../../controls/IconButton/IconButtonLink';
import {
	MenuPopper,
	MenuPopperHandle,
} from '../../display/MenuPopper/MenuPopper';
import { ToolbarItemList } from '../../display/ToolbarList/ToolbarList';
import './NavBar.css';
interface NavItem {
	name: string;
	route: string;
}
interface NavBarProps {
	currentPage: string;
	navRoutes: NavRoute[];
}

const sx = {
	homeIconGroup: { display: 'flex', mr: 3 },
	spacer: { flexGrow: 0.75 },
	toolAndExternalLinksGroup: {
		display: 'flex',
		alignItems: 'center',
		gap: 1,
		ml: 'auto',
		mr: 1,
	},
	externalLinksGroup: {
		display: 'flex',
		gap: 1,
	},
	mobileAuthGroup: { display: { xs: 'flex', sm: 'none' }, },
} satisfies Record<string, SxProps<Theme>>;

function NavBar({ currentPage, navRoutes }: NavBarProps) {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
	const { user, authLoading } = useSupabase();
	const { githubUser, authLoading: githubAuthLoading } = useGitHub();
	const { requestAuth } = useAuthRequest();
	const isClipboardPage = currentPage === '/clipboard';
	const isNotesPage = currentPage === '/note';
	const isCoverLetterGeneratorPage = currentPage === '/cover-letter-generator';
	const showAuthIcon = isCoverLetterGeneratorPage || isNotesPage || isClipboardPage;
	const [isMenuOpen, setIsMenuOpen] = React.useState(false);
	const [menuAnchor, setMenuAnchor] = React.useState<HTMLElement | null>(null);
	const [menuItems, setMenuItems] = React.useState<NavRoute[]>([]);
	const [openMenuRoute, setOpenMenuRoute] = React.useState<string | null>(null);
	const menuPopperRef = React.useRef<MenuPopperHandle>(null);
	const pendingFocusFirst = React.useRef(false);
	const ignoreNextFocusOpen = React.useRef(false);

	const closeMenu = useCallback(() => {
		setIsMenuOpen(false);
		setMenuAnchor(null);
		setOpenMenuRoute(null);
	}, []);

	const closeMenuSilently = useCallback(() => {
		ignoreNextFocusOpen.current = true;
		closeMenu();
	}, [closeMenu]);

	const handleCloseAndReturnFocus = useCallback(() => {
		closeMenuSilently();
		menuAnchor?.focus();
	}, [closeMenuSilently, menuAnchor]);

	React.useEffect(() => {
		closeMenu();
	}, [currentPage, closeMenu]);

	const openDropdownMenu = useCallback(
		(anchor: HTMLElement, children: NavRoute[], parentRoute: string) => {
			setMenuAnchor(anchor);
			setMenuItems(children);
			setOpenMenuRoute(parentRoute);
			setIsMenuOpen(true);
		},
		[],
	);

	const handleDropdownMouseEnter = useCallback(
		(
			event: React.MouseEvent<HTMLElement>,
			children: NavRoute[],
			parentRoute: string,
		) => {
			openDropdownMenu(event.currentTarget, children, parentRoute);
		},
		[openDropdownMenu],
	);

	const handleDropdownFocus = useCallback(
		(
			event: React.FocusEvent<HTMLElement>,
			children: NavRoute[],
			parentRoute: string,
		) => {
			if (ignoreNextFocusOpen.current) {
				ignoreNextFocusOpen.current = false;
				return;
			}
			openDropdownMenu(event.currentTarget, children, parentRoute);
		},
		[openDropdownMenu],
	);

	const handleDropdownBlur = useCallback(
		(event: React.FocusEvent<HTMLElement>) => {
			const relatedTarget = event.relatedTarget as HTMLElement | null;
			if (relatedTarget?.closest('[role="menu"]')) {
				return;
			}
			closeMenu();
		},
		[closeMenu],
	);

	const handleDropdownClick = useCallback(() => {
		closeMenu();
	}, [closeMenu]);

	const handleDropdownKeyDown = useCallback(
		(
			event: React.KeyboardEvent<HTMLElement>,
			children: NavRoute[],
			parentRoute: string,
		) => {
			if (event.key === 'Escape') {
				event.preventDefault();
				closeMenu();
				return;
			}

			if (event.key === 'Enter') {
				closeMenu();
				return;
			}

			if (event.key !== 'ArrowDown') {
				return;
			}

			event.preventDefault();
			const anchor = event.currentTarget;

			if (!isMenuOpen || menuAnchor !== anchor) {
				pendingFocusFirst.current = true;
				openDropdownMenu(anchor, children, parentRoute);
			} else {
				menuPopperRef.current?.focusFirstItem();
			}
		},
		[closeMenu, isMenuOpen, menuAnchor, openDropdownMenu],
	);

	React.useEffect(() => {
		if (isMenuOpen && pendingFocusFirst.current) {
			pendingFocusFirst.current = false;
			menuPopperRef.current?.focusFirstItem();
		}
	}, [isMenuOpen, menuItems]);

	const openMenu = useCallback(
		(
			event: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>,
			children: NavRoute[],
		) => {
			setMenuAnchor(event.currentTarget as HTMLElement);
			setMenuItems(children);
			setIsMenuOpen(true);
		},
		[],
	);

	const toolbarItems = useMemo(() => {
		return navRoutes
			.filter((r) => r.label && !r.hide)
			.map((r) => {
				const visibleChildren = r.children?.filter((c) => !c.hide);
				return {
					label: r.label!,
					route: r.route,
					isActive: r.route === currentPage,
					onMouseEnter: visibleChildren?.length
						? (e) => handleDropdownMouseEnter(e, visibleChildren, r.route)
						: r.onMouseEnter,
					onFocus: visibleChildren?.length
						? (e) => handleDropdownFocus(e, visibleChildren, r.route)
						: undefined,
					onBlur: visibleChildren?.length ? handleDropdownBlur : undefined,
					onClick: visibleChildren?.length ? handleDropdownClick : undefined,
					onKeyDown: visibleChildren?.length
						? (e) => handleDropdownKeyDown(e, visibleChildren, r.route)
						: r.onKeyDown,
					ariaHasPopup: visibleChildren?.length ? true : undefined,
					ariaExpanded: visibleChildren?.length
						? openMenuRoute === r.route
						: undefined,
				};
			});
	}, [
		currentPage,
		handleDropdownBlur,
		handleDropdownClick,
		handleDropdownFocus,
		handleDropdownKeyDown,
		handleDropdownMouseEnter,
		openMenuRoute,
		navRoutes,
	]) as NavRoute[];

	const hamburgerItems = useMemo(() => {
		return navRoutes
			.filter((r) => !r.hide)
			.map((r) => ({
				label: r.label! ?? 'Home',
				route: r.route,
				isActive: r.route === currentPage,
			}));
	}, [currentPage, navRoutes]) as NavRoute[];

	return (
		<AppBar id='navbar' position='static'>
			<Container maxWidth={false}>
				<Toolbar disableGutters>
					<Box id='navbar'>
						<Box sx={sx.homeIconGroup}>
							<IconButtonLink
								to='/'
								icon={HomeIcon}
								ariaLabel='Home'
								style={{ marginBlock: theme.spacing(1), color: colours.text }}
							/>
						</Box>
						<Box sx={sx.homeIconGroup}>
							<IconButtonLink
								to='/clipboard'
								icon={AssignmentOutlined}
								ariaLabel='Clipboard'
								style={{ marginBlock: theme.spacing(1), color: colours.text }}
							/>
						</Box>
						<Box sx={sx.homeIconGroup}>
							<IconButtonLink
								to='/note'
								icon={EditNote}
								ariaLabel='Create Note'
								style={{
									marginBlock: theme.spacing(1),
									color: colours.text,
									fontSize: '1.75rem',
								}}
							/>
						</Box>
					</Box>

					{/* Used for empty space on bar */}
					<Box sx={sx.spacer}> </Box>

					<ToolbarItemList items={toolbarItems} />

					{menuItems.length > 0 && isMenuOpen && (
						<MenuPopper
							ref={menuPopperRef}
							anchorElement={menuAnchor!}
							handleCloseMenu={closeMenu}
							handleCloseAndReturnFocus={handleCloseAndReturnFocus}
							menuItems={menuItems}
						/>
					)}

					{isMobile && showAuthIcon && (
						<Box sx={sx.mobileAuthGroup}>
							<AuthIconButton
								inline
								user={isNotesPage ? githubUser : user}
								authLoading={isNotesPage ? githubAuthLoading : authLoading}
								onClick={requestAuth}
							/>
						</Box>
					)}

					<Box sx={sx.toolAndExternalLinksGroup}>
						{(
							<IconButtonLink
								to='/cover-letter-generator'
								icon={AssignmentIndOutlined}
								ariaLabel='Cover Letter Generator'
								style={{ color: colours.text }}
							/>
						)}
						{!isMobile && (<Box sx={sx.externalLinksGroup}>
							{externalLinks.map((link, index) => (
								<IconButtonLink
									key={index}
									href={link.href}
									icon={link.icon}
									ariaLabel={link.label}
									style={{ color: colours.text }}
								/>
							))}
						</Box>)}


						<HamburgerMenu handleOpenMenu={(e) => openMenu(e, hamburgerItems)} />
					</Box>
				</Toolbar>
			</Container>
		</AppBar>
	);
}

export { NavBar, NavItem };
