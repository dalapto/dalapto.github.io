import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Button, Card, CardMedia, Fade } from '@mui/material';
import Stack from '@mui/material/Stack';
import { Link } from 'react-router-dom';
import './Tile.css';

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
	to?: string;
	href?: string;
	ariaLabel?: string;
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
	to,
	href,
	ariaLabel,
}: TileProps) {
	const [showLabel, setShowLabel] = React.useState<boolean>(!showLabelOnMouseOver);

	function handleMouseOver() {
		if (!showLabelOnMouseOver) {
			return;
		}
		setShowLabel(true);
	}

	function handleMouseLeave() {
		if (!showLabelOnMouseOver) {
			return;
		}
		setShowLabel(false);
	}

	function handleFocus() {
		if (!showLabelOnMouseOver) {
			return;
		}
		setShowLabel(true);
	}

	function handleBlur() {
		if (!showLabelOnMouseOver) {
			return;
		}
		setShowLabel(false);
	}

	// Determine button props based on link type
	const buttonProps = href
		? { component: 'a', href, target: '_blank', rel: 'noopener noreferrer' }
		: to
		? { component: Link, to }
		: {};

	return (
		<Card className={className} onMouseEnter={handleMouseOver} onMouseLeave={handleMouseLeave} sx={{ backgroundColor: backgroundColour, boxShadow: 'none' }}>
			<Button 
				className="tile-button"
				onFocus={handleFocus}
				onBlur={handleBlur}
				aria-label={ariaLabel}
				{...buttonProps}
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
							<Stack spacing={16} className="tile-text-container">
								<Box></Box>
								<Typography id="tile-text" letterSpacing={1.5} fontFamily="monospace" variant="h4" color="white" sx={{ textTransform: 'capitalize' }}>
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
export { Tile };
