import * as React from 'react';
import { Button } from '@mui/material';
import './Tile.css';

export interface TooltipButtonProps {
	icon: string;
	tooltip_text: string;
}

// TO DO:
function TooltipButton({ icon = '../src/img/tile-aboutmehome.png', tooltip_text = '' }: TooltipButtonProps) {
	return (
		<Button disabled>
			{icon}
			{tooltip_text}
		</Button>
	);
}
export default TooltipButton;
