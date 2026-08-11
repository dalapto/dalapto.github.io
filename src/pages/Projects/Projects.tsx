import React, { useEffect } from 'react';
import { HubPage } from '../../components/layout/HubPage/HubPage';
import { ImgPaths } from '../../constants/img-paths';
import { translations } from '../../constants/projects-constants';
import { useBackground } from '../../context/BackgroundContext';
import { navRoutes } from '../../routes';

const tileImages: Record<string, string> = {
	'/m2tw': ImgPaths.pages.home.tile.m2,
	'/ron': ImgPaths.bg.m2,
	'/cover-letter-generator': ImgPaths.pages.home.tile.m2,
};

const tileBgPositions: Record<string, string> = {
	'/m2tw': 'center 35%',
};

function Projects() {
	const { setBackground } = useBackground();

	useEffect(() => {
		setBackground(null, { freezeObservers: false });
	}, [setBackground]);

	const projectsRoute = navRoutes.find((r) => r.route === '/projects');
	const pages =
		projectsRoute?.children?.filter((r) => r.label && !r.hide) ?? [];

	return (
		<HubPage
			title='Projects'
			ariaLabel='Projects'
			blurb={translations.projects_blurb}
			pages={pages}
			tileImages={tileImages}
			tileBgPositions={tileBgPositions}
		/>
	);
}

export { Projects };
