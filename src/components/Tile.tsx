import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Card, CardMedia } from '@mui/material';
import Stack from '@mui/material/Stack';

export interface TileProps {
	image_path: string;
	text: string;
	img_width: number;
	img_height: number;
}

function Tile({ image_path = '../src/img/tile-aboutmehome.png', text = '', img_width = 300, img_height = 300 }: TileProps) {
	return (
		<Card>
			<CardMedia image={image_path} sx={{ width: img_width, height: img_height }}>
				<Stack spacing={16}>
					<Box></Box>
					<Typography letterSpacing={3.5} variant="h4" justifyItems="center" alignContent="center" color="white">
						{text}
					</Typography>
					<Box></Box>
				</Stack>
			</CardMedia>
		</Card>
	);
}
export default Tile;
