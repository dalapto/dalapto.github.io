import { About } from './pages/About/About';
import { LITTER_APP_PATH, RECYCLOTRON_PATH } from './constants/route-paths';
import { Home } from './pages/Home/Home';
import { LitterApp } from './pages/Projects/LitterApp/LitterApp';
import { Medieval2TotalWar } from './pages/Projects/m2tw/m2tw';
import { Projects } from './pages/Projects/Projects';
import { Recyclotron } from './pages/Projects/Recylotron/recylotron';
import { RiseOfNations } from './pages/Projects/RON/Ron';
import { YouthWork } from './pages/YouthWork/YouthWork';

/**
 * Interface for a single route or page.
 */
interface NavRoute {
	label?: string;
	route: string;
	tileImg?: string;
	hide?: boolean;
	component?: () => React.ReactNode;
	children?: NavRoute[];
	onMouseEnter?: (_event: React.MouseEvent<HTMLElement>) => void;
	onClick?: (_event: React.MouseEvent<HTMLElement>) => void;
	onKeyDown?: (_event: React.KeyboardEvent<HTMLElement>) => void;
	isActive?: boolean;
	ariaHasPopup?: boolean;
	ariaExpanded?: boolean;
}

const projectsRoutes: NavRoute[] = [
	{ label: 'Cover Letter Generator', route: '/cover-letter-generator' },
	{ label: 'Clipboard', route: '/clipboard' },
];

const moddingRoutes: NavRoute[] = [
	{ label: 'Medieval 2: Total War', route: '/m2tw', component: Medieval2TotalWar },
	{ label: 'Rise of Nations', route: '/ron', component: RiseOfNations },
];

const litterAppRoute: NavRoute = { label: 'LitterApp', route: LITTER_APP_PATH, component: LitterApp, hide: true };
const recyclotronRoute: NavRoute = { label: 'Recyclotron', route: RECYCLOTRON_PATH, component: Recyclotron, hide: true };

const aboutRoutes: NavRoute[] = [litterAppRoute, recyclotronRoute];


const navRoutes: NavRoute[] = [
	{ route: '/', component: Home, hide: true },
	{
		label: 'About',
		route: '/about/me',
		tileImg: 'about',
		component: About,
		children: [...aboutRoutes],
	},
	{
		label: 'Projects',
		route: '/projects',
		tileImg: 'm2',
		component: Projects,
		children: [...projectsRoutes, ...moddingRoutes],
	},
	{
		label: 'Youth Work',
		route: '/youth',
		tileImg: 'blog',
		component: YouthWork,
	},
	{ label: 'Writing', route: '/writing' },
];


export { NavRoute, navRoutes, litterAppRoute, recyclotronRoute };
