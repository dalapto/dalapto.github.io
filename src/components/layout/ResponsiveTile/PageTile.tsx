import React from 'react';
import { NavRoute } from '../../../constants/routes';
import { Image } from '../../../types/basic.types';
import { TileActionKind } from '../../display/Tile/Tile';
import { ResponsiveTile } from './ResponsiveTile';

interface PageTileProps {
	page: NavRoute;
	/** Override the tile image path (e.g. '/img/tile/foo.png'). Falls back to the path derived from `page.tileImg`. */
	image?: Image;
	/** Override the background image position. Falls back to `page.bgImgPosition`. */
	bgImgPosition?: string;
	/** When true, hovering the tile will not update the page background. */
	disableHoverBackground?: boolean;
}

function PageTile({ page, image, disableHoverBackground }: PageTileProps) {
	const resolvedImagePath = image?.src ?? `/img/tile/${page.tileImg}.png`;
	const resolvedBgPosition = page.bgImgPosition;

	const bgConfig = {
		image: { src: resolvedImagePath, alt: '' },
		imagePosition: resolvedBgPosition,
		transitionDuration: 300,
		blur: 3,
	};

	return (
		<ResponsiveTile
			imagePath={resolvedImagePath}
			text={page.label!}
			action={{ kind: TileActionKind.Route, to: page.route }}
			ariaLabel={page.label!}
			bgConfig={bgConfig}
			disableHoverBackground={disableHoverBackground}
		/>
	);
}

export { PageTile };
export type { PageTileProps };
