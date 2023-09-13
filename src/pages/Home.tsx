import { Box, Grid, Typography } from '@mui/material';
import { Container } from '@mui/system';
import React from 'react';
import Tile from '../components/Tile';

function Home() {
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
					{/* grid with 3 rows */}
					<Grid container columnSpacing={3} justifyContent="center">
						<Grid item>
							<Tile image_path={'../src/img/tile-aboutmehome.png'} text={'About Me'} img_width={300} img_height={300} />
						</Grid>
						<Grid item>
							<Tile image_path={'../src/img/tile-m2home.png'} text={'Projects'} img_width={300} img_height={300} />
						</Grid>

						<Grid item>
							<Tile image_path={'../src/img/tile-bloghome.png'} text={'Blog'} img_width={300} img_height={300} />
						</Grid>
					</Grid>
				</Box>
			</Container>
		</div>
	);
}
export default Home;
