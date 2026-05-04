import { Grid } from '@mui/material';
import React from 'react';
import { Tile, TileAction } from '../../display/Tile/Tile';
import type { BackgroundConfig } from '../../../context/BackgroundContext';
import { useHoverBackground } from '../../../hooks/useHoverBackground';
import { useScrollBackground } from '../../../hooks/useScrollBackground';

interface ResponsiveTileProps {
	imagePath: string;
	text: string;
	action: TileAction;
	ariaLabel?: string;
	bgConfig: BackgroundConfig;
	disableHoverBackground?: boolean;
}

function ResponsiveTile({ imagePath, text, action, ariaLabel, bgConfig, disableHoverBackground }: ResponsiveTileProps) {
	const { onMouseEnter, onMouseLeave } = useHoverBackground({ config: bgConfig });
	const scrollRef = useScrollBackground<HTMLDivElement>({ config: bgConfig });

	const sharedProps = {
		image_path: imagePath,
		text,
		imgWidth: 300,
		imgHeight: 300,
		blurValue: 0.5,
		opacityValue: 0.7,
		growFromValue: 0.85,
		backgroundColour: 'rgb(0,0,0,0)',
		action,
		ariaLabel,
	};

	return (
		<Grid className='home-tile' item sx={{ width: 'fit-content' }}>
			<Tile className='tile-pc' showLabelOnMouseOver={true} onMouseEnter={disableHoverBackground ? undefined : onMouseEnter} onMouseLeave={disableHoverBackground ? undefined : onMouseLeave} {...sharedProps} />
			<div ref={scrollRef}>
				<Tile className='tile-mobile' showLabelOnMouseOver={false} {...sharedProps} />
			</div>
		</Grid>
	);
}

export type { ResponsiveTileProps };
export { ResponsiveTile };
