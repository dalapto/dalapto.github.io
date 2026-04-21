import * as React from 'react';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import { Box, SxProps, Theme } from '@mui/material';

export interface ToolbarListItem {
	label: string;
	route?: string;
	onMouseEnter?: (_event: React.MouseEvent<HTMLElement>) => void;
	onClick?: (_event: React.MouseEvent<HTMLElement>) => void;
	isActive?: boolean;
}

interface ToolbarListProps {
	items: ToolbarListItem[];
	containerSx?: SxProps<Theme>;
	buttonSx?: SxProps<Theme>;
	typographySx?: SxProps<Theme>;
	activeButtonId?: string;
	inactiveButtonId?: string;
	renderItem?: (_item: ToolbarListItem) => React.ReactNode;
}

function ToolbarList({
	items,
	containerSx = {
		flexGrow: 0.25,
		display: {
			justifyContent: 'space-around',
			xs: 'none',
			md: 'flex',
		},
	},
	buttonSx = { my: 2, color: 'white', display: 'block' },
	typographySx = {
		textTransform: 'capitalize',
		fontFamily: 'arial',
		fontSize: '1.2rem',
	},
	activeButtonId = 'navbar-button-selected',
	inactiveButtonId = 'navbar-button',
	renderItem,
}: ToolbarListProps) {
	const defaultRenderItem = (item: ToolbarListItem) => (
		<Typography textAlign="center" sx={typographySx}>
			{item.label}
		</Typography>
	);

	return (
		<Box sx={containerSx}>
			{items.map((item) => (
				<Button
					key={item.label}
					id={item.isActive ? activeButtonId : inactiveButtonId}
					component={item.route ? Link : 'button'}
					to={item.route || undefined}
					onMouseEnter={item.onMouseEnter}
					onClick={item.onClick}
					sx={buttonSx}
				>
					{renderItem ? renderItem(item) : defaultRenderItem(item)}
				</Button>
			))}
		</Box>
	);
}

export { ToolbarList };

