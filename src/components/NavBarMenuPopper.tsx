import * as React from 'react';
import './NavBar.css';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';
import { Box, Fade, MenuItem, Popper } from '@mui/material';

interface NavBarMenuPopperProps {
	anchorElement: Element | HTMLElement;
	handleOpenMenu: Function;
	handleCloseMenu: Function;
	menuItems: { route: string; name: string }[]; // TODO define object type
}

function NavBarMenuPopper({ anchorElement, handleOpenMenu, handleCloseMenu, menuItems, ...delegated }: NavBarMenuPopperProps) {
	return (
		<Popper
			id="menu-appbar"
			anchorEl={anchorElement}
			placement="bottom"
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
			open={Boolean(anchorElement)}
			onMouseLeave={() => handleCloseMenu()}
		>
			{({ TransitionProps }) => (
				<Fade {...TransitionProps} timeout={300}>
					<Box>
						{menuItems.map((item) => (
							<MenuItem key={item.route} component={Link} to={`/${item.route}`}>
								<Typography id="menu-appbar-item" textAlign="center" color={'white'} onClick={() => handleCloseMenu()}>
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
export default NavBarMenuPopper;
