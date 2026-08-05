import { Box, Fade, MenuItem, Popper } from '@mui/material';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useClickOutside } from '../../../hooks/useClickOutside';
import { NavRoute } from '../../../routes';
import '../../layout/NavBar/NavBar.css';

interface MenuPopperProps {
	anchorElement: Element | HTMLElement;
	handleCloseMenu: () => void;
	handleCloseAndReturnFocus: () => void;
	menuItems: NavRoute[];
}

interface MenuPopperHandle {
	focusFirstItem: () => void;
}

const MenuPopper = React.forwardRef<MenuPopperHandle, MenuPopperProps>(
	function MenuPopper(
		{ anchorElement, handleCloseMenu, handleCloseAndReturnFocus, menuItems },
		ref,
	) {
		const isOpen = Boolean(anchorElement);
		const menuRef = React.useRef<HTMLDivElement>(null);
		const anchorRef = React.useRef<Element>(anchorElement);
		anchorRef.current = anchorElement;
		const itemRefs = React.useRef<(HTMLElement | null)[]>([]);
		const navigate = useNavigate();

		React.useImperativeHandle(ref, () => ({
			focusFirstItem: () => {
				requestAnimationFrame(() => {
					itemRefs.current[0]?.focus();
				});
			},
		}));

		useClickOutside(isOpen, [menuRef, anchorRef], handleCloseMenu);

		const handleMenuBlur = (event: React.FocusEvent) => {
			const relatedTarget = event.relatedTarget as HTMLElement | null;
			if (
				relatedTarget &&
				(relatedTarget === anchorElement ||
					menuRef.current?.contains(relatedTarget))
			) {
				return;
			}
			handleCloseMenu();
		};

		const handleMenuKeyDown = (
			e: React.KeyboardEvent,
			index: number,
			route: string,
		) => {
			switch (e.key) {
				case 'Escape':
					e.preventDefault();
					handleCloseAndReturnFocus();
					break;
				case 'Tab':
					if (!e.shiftKey && index === menuItems.length - 1) {
						handleCloseMenu();
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
					navigate(route);
					handleCloseMenu();
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
						<Box
							ref={menuRef}
							role='menu'
							aria-label='Projects submenu'
							onBlur={handleMenuBlur}
						>
							{menuItems.map((item, index) => (
								<MenuItem
									key={item.route}
									id='menu-appbar-item'
									ref={(el: HTMLElement | null) => {
										itemRefs.current[index] = el;
									}}
									component={Link}
									to={item.route}
									role='menuitem'
									tabIndex={0}
									onClick={() => handleCloseMenu()}
									onKeyDown={(e: React.KeyboardEvent) =>
										handleMenuKeyDown(e, index, item.route)
									}
								>
									<Typography
										className='menu-appbar-item-text'
										textAlign='center'
										color={'white'}
									>
										{item.label!}
									</Typography>
								</MenuItem>
							))}
						</Box>
					</Fade>
				)}
			</Popper>
		);
	},
);
export { MenuPopper, MenuPopperHandle };
