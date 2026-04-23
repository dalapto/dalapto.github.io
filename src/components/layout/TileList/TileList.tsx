import * as React from 'react';
import { Tile } from '../../common/Tile/Tile';

interface TileListProps {
	items: { text: string; link: string; img: string }[];
	imgSize?: number | string;
	direction?: 'row' | 'column';
	title?: string;
	imgPathPrefix?: string;
	className?: string;
	blurValue?: number;
	opacityValue?: number;
	growFromValue?: number;
	backgroundColour?: string;
	showLabelOnMouseOver?: boolean;
}

function TileList({
	items,
	imgSize = '100px',
	direction = 'row',
	title,
	imgPathPrefix = '',
	className = 'tile-list',
	blurValue = 0,
	opacityValue = 1,
	growFromValue = 0.9,
	backgroundColour = '#7F7164',
	showLabelOnMouseOver = true,
	...delegated
}: TileListProps) {
	return (
		<div className={className} style={{ marginBlock: '48px 5px' }}>
			{title && <h3>{title}</h3>}
			<div
				style={{
					flexDirection: direction,
					display: 'flex',
					justifyContent: 'center',
				}}
			>
				{items.map(({ text, link, img }) => {
					return (
						<Tile
							key={img}
							{...delegated}
							image_path={`${imgPathPrefix}${img}`}
							text={''}
							imgWidth={imgSize}
							imgHeight={imgSize}
							blurValue={blurValue}
							opacityValue={opacityValue}
							growFromValue={growFromValue}
							backgroundColour={backgroundColour}
							showLabelOnMouseOver={showLabelOnMouseOver}
							className={''}
							to={link}
							ariaLabel={text}
						/>
					);
				})}
			</div>
		</div>
	);
}
export { TileList };
