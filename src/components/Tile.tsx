import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Button, Card, CardMedia, Fade } from '@mui/material';
import Stack from '@mui/material/Stack';
import './Tile.css';

export interface TileProps {
	image_path: string;
	text: string;
	img_width: number;
	img_height: number;
}

function Tile({ image_path = '/img/tile-aboutmehome.png', text = '', img_width = 300, img_height = 300 }: TileProps) {
	const [isMouseOver, setMouseOver] = React.useState<boolean>(false);

	return (
		<Card onMouseEnter={() => setMouseOver(true)} onMouseLeave={() => setMouseOver(false)} sx={{ backgroundColor: 'rgba(0,0,0,0)', boxShadow: 'none' }}>
			<Button disabled>
				<CardMedia
					image={image_path}
					sx={{
						width: img_width,
						height: img_height,
						filter: isMouseOver ? '' : 'blur(1px)',
						opacity: isMouseOver ? '1' : '0.7',
						transitionDuration: '1s',
						transform: isMouseOver ? 'scale(1)' : 'scale(0.85)',
					}}
				>
					<Fade in={isMouseOver} timeout={1000}>
						<Stack spacing={16}>
							<Box></Box>
							<Typography id="tile-text" letterSpacing={3.5} fontFamily="monospace" variant="h4" color="white" sx={{ textTransform: 'capitalize' }}>
								{text}
							</Typography>
						</Stack>
					</Fade>
				</CardMedia>
			</Button>
		</Card>
	);
}
export default Tile;
