import { Box, Fade, MenuItem, Popper } from '@mui/material';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../layout/NavBar/NavBar.css';

interface MenuPopperProps {
	anchorElement: Element | HTMLElement;
	handleCloseMenu: () => void;
	menuItems: { route: string; name: string }[]; // TODO define object type
}

function MenuPopper({
	anchorElement,
	handleCloseMenu,
	menuItems,
}: MenuPopperProps) {
	const isOpen = Boolean(anchorElement);
	const menuRef = React.useRef<HTMLDivElement>(null);
	const itemRefs = React.useRef<(HTMLElement | null)[]>([]);
	const navigate = useNavigate();

	// Focus the first menu item when menu opens
	React.useEffect(() => {
		if (isOpen) {
			// Wait for Fade transition to mount the items
			const frame = requestAnimationFrame(() => {
				itemRefs.current[0]?.focus();
			});
			return () => cancelAnimationFrame(frame);
		}
	}, [isOpen]);

	// Close when clicking outside
	React.useEffect(() => {
		if (!isOpen) return;
		const handleClickOutside = (e: MouseEvent) => {
			if (
				menuRef.current &&
				!menuRef.current.contains(e.target as Node) &&
				anchorElement &&
				!anchorElement.contains(e.target as Node)
			) {
				handleCloseMenu();
			}
		};
		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, [isOpen, anchorElement, handleCloseMenu]);

	const closeAndReturnFocus = React.useCallback(() => {
		handleCloseMenu();
		(anchorElement as HTMLElement).focus();
	}, [handleCloseMenu, anchorElement]);

	const handleMenuKeyDown = (
		e: React.KeyboardEvent,
		index: number,
		route: string,
	) => {
		switch (e.key) {
			case 'Escape':
				e.preventDefault();
				closeAndReturnFocus();
				break;
			case 'Tab':
				if (!e.shiftKey) {
					if (index === menuItems.length - 1) {
						// Last item: close menu and let Tab continue naturally
						e.preventDefault();
						closeAndReturnFocus();
					}
					// else let Tab move to next item naturally (browser handles it within the menu)
				} else {
					if (index === 0) {
						// First item + Shift+Tab: close and return focus
						e.preventDefault();
						closeAndReturnFocus();
					}
				}
				break;
			case 'ArrowDown':
				e.preventDefault();
				itemRefs.current[(index + 1) % menuItems.length]?.focus();
				break;
			case 'ArrowUp':
				e.preventDefault();
				itemRefs.current[
					(index - 1 + menuItems.length) % menuItems.length
				]?.focus();
				break;
			case ' ':
			case 'Enter':
				e.preventDefault();
				navigate(`/${route}`);
				closeAndReturnFocus();
				break;
		}
	};

	return (
		<Popper
			id='menu-appbar'
			anchorEl={anchorElement}
			placement='bottom'
			modifiers={[
				{
					name: 'offset',
					enabled: true,
					options: {
						offset: [0, 10],
					},
				},
				{
					name: 'flip',
					enabled: false,
					options: {
						altBoundary: false,
						rootBoundary: 'document',
						padding: 20,
					},
				},
				{
					name: 'preventOverflow',
					enabled: true,
					options: {
						altAxis: true,
						altBoundary: true,
						tether: true,
						rootBoundary: 'document',
						padding: 20,
					},
				},
				{
					name: 'arrow',
					enabled: false,
				},
			]}
			transition
			open={isOpen}
			onMouseLeave={() => handleCloseMenu()}
		>
			{({ TransitionProps }) => (
				<Fade {...TransitionProps} timeout={300}>
					<Box ref={menuRef} role='menu' aria-label='Projects submenu'>
						{menuItems.map((item, index) => (
							<MenuItem
								key={item.route}
								id='menu-appbar-item'
								ref={(el: HTMLElement | null) => {
									itemRefs.current[index] = el;
								}}
								component={Link}
								to={`/${item.route}`}
								role='menuitem'
								tabIndex={0}
								onClick={() => closeAndReturnFocus()}
								onKeyDown={(e: React.KeyboardEvent) =>
									handleMenuKeyDown(e, index, item.route)
								}
							>
								<Typography
									className='menu-appbar-item-text'
									textAlign='center'
									color={'white'}
								>
									{item.name}
								</Typography>
							</MenuItem>
						))}
					</Box>
				</Fade>
			)}
		</Popper>
	);
}
export { MenuPopper };
