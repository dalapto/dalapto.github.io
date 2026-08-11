import { Box, Grid, Typography } from '@mui/material';
import { Container } from '@mui/system';
import React from 'react';
import { TextList } from '../../display/TextList/TextList';
import { NavRoute } from '../../../routes';
import { Image } from '../../../types/basic.types';
import { PageTile } from '../ResponsiveTile/PageTile';

interface HubPageProps {
	title: React.ReactNode;
	ariaLabel: string;
	blurb: string[];
	pages: NavRoute[];
	tileImages?: Record<string, string>;
	tileBgPositions?: Record<string, string>;
	columnSpacing?: number;
}

const titleSx = {
	fontSize: { xs: '1.75rem', sm: '2.5rem', md: '3.75rem' },
	letterSpacing: { xs: 2, sm: 3, md: 5 },
};

function HubPage({
	title,
	ariaLabel,
	blurb,
	pages,
	tileImages,
	tileBgPositions,
	columnSpacing,
}: HubPageProps) {
	const pageTiles = pages.map((page) => {
		const imageSrc = tileImages?.[page.route];
		const image: Image | undefined = imageSrc
			? { src: imageSrc, alt: page.label ?? '' }
			: undefined;

		return (
			<PageTile
				key={page.route}
				page={page}
				image={image}
				bgImgPosition={tileBgPositions?.[page.route]}
			/>
		);
	});

	return (
		<div className='App'>
			<Container>
				<Box marginTop={'5%'}>
					<Typography
						variant='h2'
						fontFamily='monospace'
						aria-label={ariaLabel}
						sx={titleSx}
					>
						{title}
					</Typography>
				</Box>
				<Box marginTop={'5%'}>
					<span>{<TextList strings={blurb} />}</span>
				</Box>
				<Box marginTop={'5%'}>
					<Grid
						container
						columnSpacing={columnSpacing ?? pages.length}
						justifyContent='center'
					>
						{pageTiles}
					</Grid>
				</Box>
			</Container>
		</div>
	);
}

export { HubPage };
export type { HubPageProps };
