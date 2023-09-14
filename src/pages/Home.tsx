import { Box, Grid, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { Container } from '@mui/system';
import React from 'react';
import Tile from '../components/Tile';

function Home() {
	const pages = [
		{ name: 'About Me', route: 'about', img: '../src/img/tile-aboutmehome.png' },
		{ name: 'Projects', route: 'projects', img: '../src/img/tile-m2home.png' },
		{ name: 'Blog', route: 'blog', img: '../src/img/tile-bloghome.png' },
	];
	return (
		<div className="App">
			<Container>
				<Box marginTop={'5%'}>
					{/* need to change text dynamically to different languages */}
					<Typography variant="h2" letterSpacing={4}>
						Welcome
					</Typography>
				</Box>
				<Box marginTop={'5%'}>
					<Typography variant="h4">
						{/* icons & links for each package */}
						<p>
							Making websites is fun.<br></br>So I made this one.<br></br>It uses <span>vite</span>, <span>react-ts</span>, and <span>gh-pages</span>.
						</p>
					</Typography>
					<span>Feel free to look around.</span>
				</Box>
				<Box marginTop={'5%'}>
					{/* Tiles to other pages */}
					<Grid container columnSpacing={pages.length} justifyContent="center">
						{pages.map((page) => (
							<Grid key={page.route} item>
								<Link to={`/${page.route}`}>
									<Tile image_path={page.img} text={page.name} img_width={300} img_height={300} />
								</Link>
							</Grid>
						))}
					</Grid>
				</Box>
			</Container>
		</div>
	);
}
export default Home;
