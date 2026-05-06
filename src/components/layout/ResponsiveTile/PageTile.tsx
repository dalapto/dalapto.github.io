import React from 'react';
import { ImgPaths } from '../../../constants/img-paths';
import { NavRoute } from '../../../routes';
import { Image } from '../../../types/basic.types';
import { TileActionKind } from '../../display/Tile/Tile';
import { ResponsiveTile } from './ResponsiveTile';

interface PageTileProps {
	page: NavRoute;
	/** Override the tile image path (e.g. '/img/tile/foo.png'). Falls back to the path derived from `page.tileImg`. */
	image?: Image;
	/** CSS object-position for the hover/scroll background image. */
	bgImgPosition?: string;
	/** When true, hovering the tile will not update the page background. */
	disableHoverBackground?: boolean;
}

function PageTile({ page, image, bgImgPosition, disableHoverBackground }: PageTileProps) {
	const tileKey = page.tileImg as keyof typeof ImgPaths.pages.home.tile;
	const resolvedImagePath = image?.src ?? ImgPaths.pages.home.tile[tileKey];

	const bgConfig = {
		image: { src: resolvedImagePath, alt: '' },
		imagePosition: bgImgPosition,
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
