import { Box, SxProps, Theme } from '@mui/material';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import { Link } from 'react-router-dom';

export interface ToolbarListItem {
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
		<Typography textAlign='center' sx={typographySx}>
			{item.label}
		</Typography>
	);

	return (
		<Box sx={containerSx}>
			{items.map((item) => {
				const commonProps = {
					id: item.isActive ? activeButtonId : inactiveButtonId,
					onMouseEnter: item.onMouseEnter,
					onClick: item.onClick,
					onKeyDown: item.onKeyDown,
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
						{renderItem ? renderItem(item) : defaultRenderItem(item)}
					</Button>
				) : (
					<Button key={item.label} {...commonProps}>
						{renderItem ? renderItem(item) : defaultRenderItem(item)}
					</Button>
				);
			})}
		</Box>
	);
}

export { ToolbarList };
