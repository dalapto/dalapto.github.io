import * as React from 'react';
import './NavBar.css';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import { Box } from '@mui/material';

interface NavBarMenuProps {
	anchorElement: Element | HTMLElement;
	currentPage: string;
	handleOpenMenu: Function;
	handleCloseMenu: Function;
	menuItems: string[]; // TODO define object type
}

function NavBarMenu({ anchorElement, currentPage, handleOpenMenu, handleCloseMenu, menuItems, ...delegated }: NavBarMenuProps) {
	return (
		<Box
			sx={{
				flexGrow: 0.25,
				display: {
					justifyContent: 'space-around',
					xs: 'none',
					md: 'flex',
				},
			}}
		>
			{menuItems.map((item) => (
				//@ts-ignore doesn't like passing Typography as child but it works
				<Button
					key={item}
					id={'/' + item === currentPage ? `navbar-button-selected` : `navbar-button`}
					onMouseEnter={item === 'Projects' ? handleOpenMenu : handleCloseMenu}
					onClick={item === 'Projects' ? handleOpenMenu : handleCloseMenu}
					sx={{ my: 2, color: 'white', display: 'block' }}
					children={
						<Typography
							textAlign="center"
							sx={{
								textTransform: 'capitalize',
								fontFamily: 'arial',
								fontSize: '1.2rem',
							}}
						>
							<Link style={{ textDecoration: 'none', color: 'white' }} to={`/${item}`}>
								{item}
							</Link>
						</Typography>
					}
				/>
			))}
		</Box>
	);
}
export default NavBarMenu;
