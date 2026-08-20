import { LITTER_APP_PATH, RECYCLOTRON_PATH } from './constants/route-paths';
import { About } from './pages/About/About';
import { Home } from './pages/Home/Home';
import { Clipboard } from './pages/Home/Clipboard/ClipboardPage';
import { LitterApp } from './pages/About/LitterApp/LitterApp';
import { Medieval2TotalWar } from './pages/Projects/m2tw/m2tw';
import { Notes } from './pages/Home/Notes/Notes';
import { Projects } from './pages/Projects/Projects';
import { Recyclotron } from './pages/About/Recylotron/Recylotron';
import { RiseOfNations } from './pages/Projects/RON/Ron';
import { Analog } from './pages/Writing/Analog/Analog';
import { Bannjan } from './pages/Writing/Bannjan/Bannjan';
import { Writing } from './pages/Writing/Writing';
import { YouthWork } from './pages/YouthWork/YouthWork';
import { getRouteData } from './routes-data';
import { CoverLetterGenerator } from './pages/Home/CoverLetterGenerator/CoverLetterGenerator';

/**
 * Interface for a single route or page.
 */
interface NavRoute {
	label?: string;
	route: string;
	tileImg?: string;
	hide?: boolean;
	component?: React.ComponentType;
	children?: NavRoute[];
	onMouseEnter?: (_event: React.MouseEvent<HTMLElement>) => void;
	onFocus?: (_event: React.FocusEvent<HTMLElement>) => void;
	onBlur?: (_event: React.FocusEvent<HTMLElement>) => void;
	onClick?: (_event: React.MouseEvent<HTMLElement>) => void;
	onKeyDown?: (_event: React.KeyboardEvent<HTMLElement>) => void;
	isActive?: boolean;
	ariaHasPopup?: boolean;
	ariaExpanded?: boolean;
	/** OG / SEO metadata — defined in routes-data.ts */
	ogTitle?: string;
	ogDescription?: string;
	ogImage?: string;
}

/** Spread OG metadata from routes-data.ts onto a NavRoute. */
function og(
	path: string,
): Pick<NavRoute, 'ogTitle' | 'ogDescription' | 'ogImage'> {
	const d = getRouteData(path);
	return d
		? { ogTitle: d.ogTitle, ogDescription: d.ogDescription, ogImage: d.ogImage }
		: {};
}

const projectsRoutes: NavRoute[] = [
	{
		label: 'Cover Letter Generator',
		route: '/cover-letter-generator',
		// component: CoverLetterGenerator,
		...og('/cover-letter-generator'),
		hide: true,
	},
	{
		label: 'Clipboard',
		route: '/clipboard',
		component: Clipboard,
		...og('/clipboard'),
		hide: true,
	},
	{
		label: 'Notes',
		route: '/note',
		component: Notes,
		...og('/note'),
		hide: true,
	},
];

const moddingRoutes: NavRoute[] = [
	{
		label: 'Medieval 2: Total War',
		route: '/m2tw',
		component: Medieval2TotalWar,
		...og('/m2tw'),
	},
	{
		label: 'Rise of Nations',
		route: '/ron',
		component: RiseOfNations,
		...og('/ron'),
	},
];

const writingRoutes: NavRoute[] = [
	{
		label: 'Analog',
		route: '/analog',
		component: Analog,
		...og('/analog'),
	},
	{
		label: 'Bannjan',
		route: '/bannjan',
		component: Bannjan,
		...og('/bannjan'),
	},
];

const litterAppRoute: NavRoute = {
	label: 'LitterApp',
	route: LITTER_APP_PATH,
	component: LitterApp,
	hide: true,
	...og(LITTER_APP_PATH),
};
const recyclotronRoute: NavRoute = {
	label: 'Recyclotron',
	route: RECYCLOTRON_PATH,
	component: Recyclotron,
	hide: true,
	...og(RECYCLOTRON_PATH),
};

const aboutRoutes: NavRoute[] = [litterAppRoute, recyclotronRoute];

const navRoutes: NavRoute[] = [
	{ route: '/', component: Home, hide: true, ...og('/') },
	{
		label: 'About',
		route: '/about/me',
		tileImg: 'about',
		component: About,
		children: [...aboutRoutes],
		...og('/about/me'),
	},
	{
		label: 'Youth Work',
		route: '/youth',
		tileImg: 'youthwork',
		component: YouthWork,
		...og('/youth'),
	},
	{
		label: 'Writing',
		component: Writing,
		route: '/writing',
		tileImg: 'writing',
		...og('/writing'),
		children: [...writingRoutes],
	},
	{
		label: 'Projects',
		route: '/projects',
		tileImg: 'm2',
		component: Projects,
		children: [...projectsRoutes, ...moddingRoutes],
		...og('/projects'),
	},
];

export { litterAppRoute, NavRoute, navRoutes, recyclotronRoute };
