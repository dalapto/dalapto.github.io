import { Box, Grid, Typography } from '@mui/material';
import { Container } from '@mui/system';
import React from 'react';
import { SwapText } from '../../components/display/SwapText/SwapText';
import { TextList } from '../../components/display/TextList/TextList';
import { PageTile } from '../../components/layout/ResponsiveTile/PageTile';
import { translations, welcomes } from '../../constants/home-constants';
import { navRoutes } from '../../constants/routes';
import './Home.css';

function Home() {
	const pages = navRoutes.filter((r) => r.tileImg && r.label);

	const pageTiles = pages.map((page) => (
		<PageTile key={page.route} page={page} />
	));

	return (
		<div className='App'>
			<Container>
				<Box marginTop={'5%'}>
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
					<span>{<TextList strings={translations.welcome_blurb} />}</span>
				</Box>
				<Box marginTop={'5%'}>
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
