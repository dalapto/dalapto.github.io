import React from 'react';
import './About.css';
import { TileList } from '../../components/layout/TileList/TileList';
import { ImageTextLayout } from '../../components/layout/ImageTextLayout/ImageTextLayout';
import { podcasts } from '../../constants/constants';



function About() {


	return (
		<>
			<div className="about-page">
				<ImageTextLayout
					imageSrc="/img/about/arch-move.png"
					imageAlt="Architectural photo"
					imageColumnWidth="45%"
					additionalContent={
						<TileList
							items={podcasts}
							imgSize="20vmin"
							direction={'row'}
							imgPathPrefix="/img/podcasts/"
							title="Favourite Podcasts:"
							className="podcast-tiles"
						/>
					}
				>
					<p>
						{'My name is David McAlister. I\'m a Software Developer with a Computer Science background. I\'m currently upskilling in React + TypeScript, in and out of my job.'}
					</p>
					<p>
						{'I\'m looking to specialise in Front-End Web Development. I\'m excited to learn more of what JavaScript, CSS & HTML can do.'}
					</p>
					<p>
						{'When not creating software, I\'m usually creating something else. I love cooking, writing and modding video games. I relax with a good book, good food and long walks by the sea.'}
					</p>
				</ImageTextLayout>
			</div>		</>
	);
}

export { About };
