import { Box, SxProps, Theme } from '@mui/material';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import { Link } from 'react-router-dom';
import { NavRoute } from '../../../constants/routes';

interface ToolbarItem {
	label: string;
	route?: string;
	onMouseEnter?: (_event: React.MouseEvent<HTMLElement>) => void;
	onClick?: (_event: React.MouseEvent<HTMLElement>) => void;
	onKeyDown?: (_event: React.KeyboardEvent<HTMLElement>) => void;
	isActive?: boolean;
	ariaHasPopup?: boolean;
	ariaExpanded?: boolean;
}

interface ToolbarListProps {
	items: NavRoute[];
	openMenu?: (_event: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>) => void;
	closeMenu?: () => void;
	containerSx?: SxProps<Theme>;
	buttonSx?: SxProps<Theme>;
	typographySx?: SxProps<Theme>;
	activeButtonId?: string;
	inactiveButtonId?: string;
	renderItem?: (_item: NavRoute) => React.ReactNode;
}

function ToolbarItemList({
	items,
	openMenu,
	closeMenu,
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
	const defaultRenderItem = (item: NavRoute) => (
		<Typography textAlign='center' sx={typographySx}>
			{item.label}
		</Typography>
	);
	const buttonContent = (item: NavRoute) =>
		renderItem ? renderItem(item) : defaultRenderItem(item);

	return (
		<Box sx={containerSx}>
			{items.map((item) => {
				const commonProps = {
					id: item.isActive ? activeButtonId : inactiveButtonId,
					onMouseEnter: item.onMouseEnter ? item.onMouseEnter : openMenu,
					onClick: item.onClick ? item.onClick : openMenu,
					onKeyDown: item.onKeyDown ? item.onKeyDown : openMenu,
					'aria-haspopup': item.ariaHasPopup ? ('true' as const) : undefined,
					'aria-expanded': item.ariaExpanded,
					sx: buttonSx,
				};
				return item.route ? (
					<Button
						key={item.label}
						component={Link}
						to={item.route}
						{...commonProps}
					>
						{buttonContent(item)}
					</Button>
				) : (
					<Button key={item.label} {...commonProps}>
						{buttonContent(item)}
					</Button>
				);
			})}
		</Box>
	);
}

export { ToolbarItemList, ToolbarItem };
