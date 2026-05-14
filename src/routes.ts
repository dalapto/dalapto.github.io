import { About } from './pages/About/About';
import { Home } from './pages/Home/Home';
import { LitterApp } from './pages/Projects/LitterApp/LitterApp';
import { Medieval2TotalWar } from './pages/Projects/m2tw/m2tw';
import { Projects } from './pages/Projects/Projects';
import { RiseOfNations } from './pages/Projects/RON/Ron';
import { YouthWork } from './pages/YouthWork/YouthWork';

/**
 * Interface for a single route or page.
 */
interface NavRoute {
	label?: string;
	route: string;
	tileImg?: string;
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
	{ label: 'LitterApp', route: '/litterapp', component: LitterApp },
	{ label: 'Reyclotron', route: '/recyclotron' },
	{
		label: 'Medieval 2: Total War',
		route: '/m2tw',
		component: Medieval2TotalWar,
	},
	{ label: 'Rise of Nations', route: '/ron', component: RiseOfNations },
];

const navRoutes: NavRoute[] = [
	{ route: '/', component: Home },
	{
		label: 'About',
		route: '/about',
		tileImg: 'about',
		component: About,
	},
	{
		label: 'Projects',
		route: '/projects',
		tileImg: 'm2',
		component: Projects,
		children: [...projectsRoutes],
	},
	{
		label: 'Youth Work',
		route: '/youth',
		tileImg: 'blog',
		component: YouthWork,
	},
];

export { NavRoute, navRoutes };
