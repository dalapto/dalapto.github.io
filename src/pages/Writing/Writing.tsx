import React from 'react';
import { HubPage } from '../../components/layout/HubPage/HubPage';
import { ImgPaths } from '../../constants/img-paths';
import { translations } from '../../constants/writing-constants';
import { navRoutes } from '../../routes';

const tileImages: Record<string, string> = {
	'/analog': ImgPaths.pages.writing.tile.analog,
	'/bannjan': ImgPaths.pages.writing.tile.bannjan,
    '/thetoybot': ImgPaths.pages.writing.tile.recs,
};

const tileBgPositions: Record<string, string> = {
	'/analog': 'center center',
	'/bannjan': 'center center',
	'/thetoybot': 'center center',
};

function Writing() {
	const writingRoute = navRoutes.find((r) => r.route === '/writing');
	const pages =
		writingRoute?.children?.filter((r) => r.label && !r.hide) ?? [];

	return (
		<HubPage
			title='Writing'
			ariaLabel='Writing'
			blurb={translations.writing_blurb}
			pages={pages}
			tileImages={tileImages}
			tileBgPositions={tileBgPositions}
		/>
	);
}

export { Writing };
