import { Box, Grid, Typography } from '@mui/material';
import { Container } from '@mui/system';
import React from 'react';
import { SwapText } from '../../components/display/SwapText/SwapText';
import { TextList } from '../../components/display/TextList/TextList';
import { Tile } from '../../components/display/Tile/Tile';
import { translations, welcomes } from '../../constants/home-constants';
import { NavRoute, navRoutes } from '../../constants/routes';
import { useHoverBackground } from '../../hooks/useHoverBackground';
import { useScrollBackground } from '../../hooks/useScrollBackground';
import './Home.css';

interface PageTileProps {
	page: NavRoute;
}

function PageTile({ page }: PageTileProps) {
	const bgConfig = {
		image: { src: `/img/tile/${page.tileImg}.png`, alt: '' },
		imagePosition: page.bgImgPosition,
		transitionDuration: 300,
		blur: 3,
	};

	const { onMouseEnter, onMouseLeave } = useHoverBackground({ config: bgConfig });

	const scrollRef = useScrollBackground<HTMLDivElement>({ config: bgConfig });

	const sharedProps = {
		image_path: `/img/tile/${page.tileImg}.png`,
		text: page.label!,
		imgWidth: 300,
		imgHeight: 300,
		blurValue: 0.5,
		opacityValue: 0.7,
		growFromValue: 0.85,
		backgroundColour: 'rgb(0,0,0,0)',
		to: page.route,
		ariaLabel: page.label!,
	};

	return (
		<Grid className='home-tile' key={page.route} item>
			<Tile className='tile-pc' showLabelOnMouseOver={true} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} {...sharedProps} />
			<div ref={scrollRef}>
				<Tile className='tile-mobile' showLabelOnMouseOver={false} {...sharedProps} />
			</div>
		</Grid>
	);
}

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
