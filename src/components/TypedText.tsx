import * as React from 'react';
import Typography from '@mui/material/Typography';
import './Tile.css';

export interface TypedTextProps {
	text: string;
}

// TO DO:
function TypedText({ text = '' }: TypedTextProps) {
	return (
		<Typography id="tile-text" letterSpacing={3.5} fontFamily="monospace" variant="h4" color="white" sx={{ textTransform: 'capitalize' }}>
			{text}
		</Typography>
	);
}
export default TypedText;
