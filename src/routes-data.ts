/**
 * Pure route data — no React dependencies.
 *
 * This is the single source of truth for route paths and OG/SEO metadata.
 * It can be imported by both the app (routes.ts) and the post-build Node
 * script (scripts/generate-routes.ts) that pre-generates per-route
 * index.html files for GitHub Pages.
 *
 * When adding a new route, add its entry here and add the component ref
 * in routes.ts.
 */

import { ImgPaths } from './constants/img-paths';

export const BASE_URL = 'https://dalapto.github.io';

export interface RouteData {
	path: string;
	label?: string;
	ogTitle?: string;
	ogDescription?: string;
	ogImage?: string;
}

export const routesData: RouteData[] = [
	{
		path: '/',
		label: 'Home',
		ogTitle: 'dalapto | Welcome',
		ogDescription:
			'Personal website — projects, modding, youth work, and more.',
	},
	{
		path: '/about/me',
		label: 'About',
		ogTitle: 'About | dalapto',
		ogDescription: 'A bit about my journey as a software engineer.',
		ogImage: ImgPaths.pages.about.edi,
	},
	{
		path: '/projects',
		label: 'Projects',
	},
	{
		path: '/youth',
		label: 'Youth Work',
		ogTitle: 'Youth Work | dalapto.github.io',
		ogDescription: 'Youth work and volunteering.',
	},
	{
		path: '/writing',
		label: 'Writing',
		ogTitle: 'Writing | dalapto.github.io',
		ogDescription: 'Writing and articles.',
	},
	{
		path: '/m2tw',
		label: 'Medieval 2: Total War',
	},
	{
		path: '/ron',
		label: 'Rise of Nations',
	},
	{
		path: '/uni/litterapp',
		label: 'LitterApp',
		ogTitle: 'LitterApp | dalapto.github.io',
		ogDescription: 'Location-based Social Media Android App',
		ogImage: ImgPaths.pages.litter.ui.explore,
	},
	{
		path: '/uni/recyclotron',
		label: 'Recyclotron',
		ogTitle: 'Recyclotron | dalapto.github.io',
		ogDescription: 'Auto-recyling Bin',
		ogImage: ImgPaths.pages.recylotron.other.photo2,
	},
	{
		path: '/clipboard',
		label: 'Clipboard',
		ogTitle: 'Clipboard | dalapto.github.io',
		ogDescription: 'Clipboard for saving and sharing text, images, and files.',
		ogImage: ImgPaths.pages.clipboard.windowapple,
	},
	{
		path: '/note',
		label: 'Notes',
		ogTitle: 'Notes | dalapto.github.io',
		ogDescription: 'Notes for saving text files.',
		ogImage: ImgPaths.pages.clipboard.graffiti,
	},
	{
		path: '/analog',
		label: 'Analog',
		ogTitle: 'Analog | dalapto.github.io',
		ogDescription: 'Analog story.',
		// ogImage: ImgPaths.pages.clipboard.graffiti,
	},
	{
		path: '/bannjan',
		label: 'Bannjan',
		ogTitle: 'Bannjan | dalapto.github.io',
		ogDescription: 'Bannjan story.',
		// ogImage: ImgPaths.pages.clipboard.graffiti,
	},
];

/** Look up route data by path. Strips trailing slashes so /uni/recyclotron/ matches /uni/recyclotron. */
export function getRouteData(path: string): RouteData | undefined {
	const normalised =
		path.endsWith('/') && path.length > 1 ? path.slice(0, -1) : path;
	return routesData.find((r) => r.path === normalised);
}
