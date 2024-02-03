import * as React from 'react';
import Tile from './Tile';
import { Link } from 'react-router-dom';

interface PodcastTileListProps {
	podcasts: { text: string; link: string; img: string }[];
	imgSize: number | string;
	direction: 'row' | 'column';
}

function PodcastTileList({ podcasts, imgSize = '100px', direction = 'row', ...delegated }: PodcastTileListProps) {
	return (
		<h3 className="podcast-tiles" style={{ marginBlock: '48px 5px' }}>
			Favourite Podcasts:
			<div style={{ flexDirection: direction, display: 'flex', justifyContent: 'center' }}>
				{podcasts.map(({ text, link, img }) => {
					return (
						<Link to={link}>
							<Tile
								image_path={`/img/podcasts/${img}`}
								text={''}
								imgWidth={imgSize}
								imgHeight={imgSize}
								blurValue={0}
								opacityValue={1}
								growFromValue={0.9}
								backgroundColour={'#7F7164'}
							></Tile>
						</Link>
					);
				})}
			</div>
		</h3>
	);
}
export default PodcastTileList;
