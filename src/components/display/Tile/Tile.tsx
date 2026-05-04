import { Button, Card, CardMedia, Fade } from '@mui/material';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import { Link } from 'react-router-dom';
import './Tile.css';

enum TileActionKind {
	Route = 'route',
	Href = 'href',
	Click = 'click',
	None = 'none',
}

type TileAction =
	| { kind: TileActionKind.Route; to: string }
	| { kind: TileActionKind.Href; href: string }
	| { kind: TileActionKind.Click; onClick: () => void }
	| { kind: TileActionKind.None };

export interface TileProps {
	className: string;
	image_path: string;
	text: string;
	imgWidth: string | number;
	imgHeight: string | number;
	blurValue: string | number;
	opacityValue: string | number;
	growFromValue: string | number;
	backgroundColour: string;
	showLabelOnMouseOver: boolean;
	action?: TileAction;
	onMouseEnter?: () => void;
	onMouseLeave?: () => void;
	ariaLabel?: string;
}

function resolveButtonProps(action: TileAction | undefined) {
	if (!action || action.kind === TileActionKind.None) return {};
	if (action.kind === TileActionKind.Route) return { component: Link, to: action.to };
	if (action.kind === TileActionKind.Href) return { component: 'a', href: action.href, target: '_blank', rel: 'noopener noreferrer' };
	if (action.kind === TileActionKind.Click) return { onClick: action.onClick };
	return {};
}

function Tile({
	className = 'tile',
	image_path = '/img/tile-aboutmehome.png',
	text = '',
	imgWidth = 300,
	imgHeight = 300,
	blurValue = '0px',
	opacityValue = 0.7,
	growFromValue = 0.85,
	backgroundColour = 'rgba(0,0,0,0)',
	showLabelOnMouseOver = false,
	action,
	onMouseEnter = () => {},
	onMouseLeave = () => {},
	ariaLabel,
}: TileProps) {
	const [showLabel, setShowLabel] = React.useState<boolean>(!showLabelOnMouseOver);

	function handleMouseOver() {
		onMouseEnter();
		if (!showLabelOnMouseOver) return;
		setShowLabel(true);
	}

	function handleMouseLeave() {
		onMouseLeave();
		if (!showLabelOnMouseOver) return;
		setShowLabel(false);
	}

	function handleFocus() {
		onMouseEnter();
		if (!showLabelOnMouseOver) return;
		setShowLabel(true);
	}

	function handleBlur() {
		onMouseLeave();
		if (!showLabelOnMouseOver) return;
		setShowLabel(false);
	}

	return (
		<Card
			className={className}
			onMouseEnter={handleMouseOver}
			onMouseLeave={handleMouseLeave}
			sx={{ backgroundColor: backgroundColour, boxShadow: 'none' }}
		>
			<Button
				className='tile-button'
				onFocus={handleFocus}
				onBlur={handleBlur}
				aria-label={ariaLabel}
				{...resolveButtonProps(action)}
			>
				<CardMedia
					image={image_path}
					sx={{
						width: imgWidth,
						height: imgHeight,
						filter: showLabel ? '' : `blur(${blurValue}px)`,
						opacity: showLabel ? '1' : { opacityValue },
						transitionDuration: '1s',
						transform: showLabel ? 'scale(1)' : `scale(${growFromValue})`,
					}}
				>
					{text.length > 0 && (
						<Fade in={showLabel} timeout={1000}>
							<Stack spacing={16} className='tile-text-container'>
								<Box></Box>
								<Typography
									id='tile-text'
									letterSpacing={1.5}
									fontFamily='monospace'
									variant='h4'
									color='white'
									sx={{ textTransform: 'capitalize' }}
								>
									{text}
								</Typography>
							</Stack>
						</Fade>
					)}
				</CardMedia>
			</Button>
		</Card>
	);
}

export type { TileAction };
export { Tile, TileActionKind };
