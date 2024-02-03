import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Button, Card, CardMedia, Fade } from '@mui/material';
import Stack from '@mui/material/Stack';
import './Tile.css';

export interface TileProps {
	image_path: string;
	text: string;
	imgWidth: string | number;
	imgHeight: string | number;
	blurValue: string | number;
	opacityValue: string | number;
	growFromValue: string | number;
	backgroundColour: string;
}

function Tile({
	image_path = '/img/tile-aboutmehome.png',
	text = '',
	imgWidth = 300,
	imgHeight = 300,
	blurValue = '0px',
	opacityValue = 0.7,
	growFromValue = 0.85,
	backgroundColour = 'rgba(0,0,0,0)',
}: TileProps) {
	const [isMouseOver, setMouseOver] = React.useState<boolean>(false);

	return (
		<Card onMouseEnter={() => setMouseOver(true)} onMouseLeave={() => setMouseOver(false)} sx={{ backgroundColor: backgroundColour, boxShadow: 'none' }}>
			<Button disabled>
				<CardMedia
					image={image_path}
					sx={{
						width: imgWidth,
						height: imgHeight,
						filter: isMouseOver ? '' : `blur(${blurValue}px)`,
						opacity: isMouseOver ? '1' : { opacityValue },
						transitionDuration: '1s',
						transform: isMouseOver ? 'scale(1)' : `scale(${growFromValue})`,
					}}
				>
					{text.length > 0 && (
						<Fade in={isMouseOver} timeout={1000}>
							<Stack spacing={16}>
								<Box></Box>
								<Typography id="tile-text" letterSpacing={3.5} fontFamily="monospace" variant="h4" color="white" sx={{ textTransform: 'capitalize' }}>
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
export default Tile;
