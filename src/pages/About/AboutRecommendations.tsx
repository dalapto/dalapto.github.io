import React from 'react';
import { ImageTextLayout } from '../../components/display/ImageTextLayout/ImageTextLayout';
import { TileList } from '../../components/display/TileList/TileList';
import { ImgPaths } from '../../constants/img-paths';
import { archMoveImage, recommendations } from './about-constants';

function AboutRecommendations() {
	return (
		<div className='about-image-text-section'>
			<TileList
				items={recommendations.books}
				imgSize='30vmin'
				imgHeight='50vmin'
				direction={'row'}
				imgPathPrefix={ImgPaths.pages.recommendations.books}
				title='Favourite Books:'
				className='podcast-tiles'
			/>
			<TileList
				items={recommendations.albums}
				imgSize='30vmin'
				direction={'row'}
				imgPathPrefix={ImgPaths.pages.recommendations.music}
				title='Favourite Albums:'
				className='podcast-tiles'
			/>
			<TileList
				items={recommendations.films}
				imgSize='30vmin'
				imgHeight='50vmin'
				direction={'row'}
				imgPathPrefix={ImgPaths.pages.recommendations.film}
				title='Favourite Films:'
				className='podcast-tiles'
			/>
			<TileList
				items={recommendations.tv}
				imgSize='30vmin'
				imgHeight='50vmin'
				direction={'row'}
				imgPathPrefix={ImgPaths.pages.recommendations.tv}
				title='Favourite Shows:'
				className='podcast-tiles'
			/>
			<ImageTextLayout
				image={archMoveImage}
				imageMaxWidth='45%'
				additionalContent={
					<TileList
						items={recommendations.podcasts}
						imgSize='20vmin'
						direction={'row'}
						imgPathPrefix={ImgPaths.pages.recommendations.podcasts}
						title='Favourite Podcasts:'
						className='podcast-tiles'
					/>
				}
			>
				<p>{'hey'}</p>
				<p>{'I make things, like this website'}</p>
				<p>{'ye'}</p>
			</ImageTextLayout>
		</div>
	);
}

export { AboutRecommendations };
