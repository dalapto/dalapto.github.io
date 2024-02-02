import * as React from 'react';
import './NavBar.css';
import IconButton from '@mui/material/IconButton';
import { SvgIcon } from '@mui/material';

interface NavBarIconButtonProps {
	as: 'a';
	destination: string;
	icon: typeof SvgIcon;
	style: React.CSSProperties;
}

function NavBarIconButton({ as: Tag = 'a', destination = '/', icon: Icon, style, ...delegated }: NavBarIconButtonProps) {
	return (
		// @ts-ignore
		<Tag to={destination} style={style} target="_blank" rel="noopener noreferrer" href={destination} {...delegated}>
			<IconButton>
				<Icon sx={style} />
			</IconButton>
		</Tag>
	);
}
export default NavBarIconButton;
