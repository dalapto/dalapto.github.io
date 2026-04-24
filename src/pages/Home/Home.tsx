import { Box, Grid, Typography } from '@mui/material';
import { Container } from '@mui/system';
import React from 'react';
import { SwapText } from '../../components/display/SwapText/SwapText';
import { Tile } from '../../components/display/Tile/Tile';
import { welcomes } from '../../constants/home-constants';
import { navRoutes } from '../../constants/routes';
import './Home.css';

function Home() {
	const pages = navRoutes.filter((r) => r.tileImg && r.label);

	const pageTiles = pages.map((page) => (
		<Grid className='home-tile' key={page.route} item>
			<Tile
				className='tile-pc'
				image_path={`/img/tile/${page.tileImg}.png`}
				text={page.label!}
				imgWidth={300}
				imgHeight={300}
				blurValue={0.5}
				opacityValue={0.7}
				growFromValue={0.85}
				backgroundColour={'rgb(0,0,0,0)'}
				showLabelOnMouseOver={true}
				to={page.route}
				ariaLabel={page.label!}
			/>
			<Tile
				className='tile-mobile'
				image_path={`/img/tile/${page.tileImg}.png`}
				text={page.label!}
				imgWidth={300}
				imgHeight={300}
				blurValue={0.5}
				opacityValue={0.7}
				growFromValue={0.85}
				backgroundColour={'rgb(0,0,0,0)'}
				showLabelOnMouseOver={false}
				to={page.route}
				ariaLabel={page.label!}
			/>
		</Grid>
	));

	return (
		<div className='App'>
			<Container>
				<Box marginTop={'5%'}>
					{/* changes text dynamically to different languages */}
					<Typography
						variant='h2'
						fontFamily={'monospace'}
						letterSpacing={5}
						aria-label='Welcome'
					>
						<SwapText string_list={welcomes} />
					</Typography>
				</Box>
				<Box marginTop={'5%'}>
					<span>Feel free to look around.</span>
				</Box>
				<Box marginTop={'5%'}>
					{/* Tiles to other pages */}
					<Grid
						container
						columnSpacing={navRoutes.length}
						justifyContent='center'
					>
						{pageTiles}
					</Grid>
				</Box>
			</Container>
		</div>
	);
}
export { Home };
