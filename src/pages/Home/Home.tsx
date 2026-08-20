import React from 'react';
import { SwapText } from '../../components/display/SwapText/SwapText';
import { HubPage } from '../../components/layout/HubPage/HubPage';
import { translations, welcomes } from '../../constants/home-constants';
import { navRoutes } from '../../routes';

const tileBgPositions: Record<string, string> = {
	'/about': 'center -10%',
	'/projects': 'center 100%',
	'/youth': 'center 0%',
	'/writing': 'center 40%',
};

function Home() {
	const pages = navRoutes.filter((r) => r.tileImg && r.label && !r.hide);

	return (
		<HubPage
			title={<SwapText string_list={welcomes} />}
			ariaLabel='Welcome'
			blurb={translations.welcome_blurb}
			pages={pages}
			tileBgPositions={tileBgPositions}
			columnSpacing={navRoutes.length}
		/>
	);
}

export { Home };
