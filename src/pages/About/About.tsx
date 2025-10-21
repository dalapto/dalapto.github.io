import React from 'react';
import './About.css';
import TileList from '../../components/features/TileList';
import { podcasts } from '../../constants/constants';



function About() {


	return (
		<>
			<div className="about-page">
				<figure className="horizontal-figure">
				<div className="image-column">
					<img src="/img/about/arch-move.png" />
					<TileList items={podcasts} imgSize="25vmax" direction={'column'} imgPathPrefix="/img/podcasts/" className="podcast-tiles" />
				</div>
					<div className="text-column">
						<figcaption style={{ width: '80%' }}>
								<p>
									{'My name is David McAlister. I\'m a Software Developer with a Computer Science background. I\'m currently upskilling in React + TypeScript, in and out of my job.'}
								</p>
								<p>
									{'I\'m looking to specialise in Front-End Web Development. I\'m excited to learn more of what JavaScript, CSS & HTML can do.'}
								</p>
							<p>
								{'When not creating software, I\'m usually creating something else. I love cooking, writing and modding video games. I relax with a good book, good food and long walks by the sea.'}
							</p>
						<TileList items={podcasts} imgSize="25vmin" direction={'row'} imgPathPrefix="/img/podcasts/" title="Favourite Podcasts:" className="podcast-tiles" />
					</figcaption>
					</div>
				</figure>
			</div>
		</>
	);
}

export default About;
