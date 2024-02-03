import React from 'react';
import Tile from '../components/Tile';
import { Link } from 'react-router-dom';
import './About.css';
import PodcastTileList from '../components/PodcastTileList';

function About() {
	const alignCenter = { display: 'grid', alignItems: 'center' };

	const podcasts = [
		{ text: 'Fall of Civilizations', link: 'https://fallofcivilizationspodcast.com/', img: 'fall_of_civs.jpg' },
		{ text: 'History of Rome', link: 'https://thehistoryofrome.typepad.com/', img: 'The_History_of_Rome.png' },
		{ text: 'The Rest is History', link: 'https://therestishistory.com/episodes/', img: 'rest_is_hist.jpg' },
	];

	const podcastTiles = (
		<h3 className="podcast-tiles" style={{ marginBlock: '48px 5px' }}>
			Favourite Podcasts:
			<div style={{ flexDirection: 'column', display: 'flex', justifyContent: 'center' }}>
				{podcasts.map(({ text, link, img }) => {
					return (
						<Link to={link}>
							<Tile
								image_path={`/img/podcasts/${img}`}
								text={''}
								imgWidth={'25vh'}
								imgHeight={'25vh'}
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

	return (
		<>
			<div className="about-page">
				<figure className="horizontal-figure">
					<div className="image-column">
						<img src="/img/about/arch-move.png" />
						<PodcastTileList podcasts={podcasts} direction={'column'} />
					</div>
					<div className="text-column">
						<figcaption style={{ width: '80%' }}>
							<p>
								My name is David McAlister. I'm a Software Developer with a Computer Science background. <br></br>I'm currently upskilling in{' '}
								<strong>React + TypeScript</strong>, in and out of my job.
							</p>
							<p>
								I'm looking to specialise in Front-End Web Development.<br></br> I'm excited to learn more of what JavaScript, CSS & HTML can do.
							</p>
							<p>
								When not creating software, I'm usually creating something else. I love cooking, writing and modding video games. I relax with a good book, good
								food and long walks by the sea.
							</p>
							<PodcastTileList podcasts={podcasts} direction={'row'} />
						</figcaption>
					</div>
				</figure>
			</div>
		</>
	);
}

export default About;
