import { About } from './pages/About/About';
import { Home } from './pages/Home/Home';
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
	bgImgPosition?: string;
}

const projectsRoutes: NavRoute[] = [
	{ label: 'Cover Letter Generator', route: '/cover-letter-generator' },
	{ label: 'Clipboard', route: '/clipboard' },
	{ label: 'LitterApp', route: '/litterapp' },
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
		bgImgPosition: 'center -10%',
	},
	{
		label: 'Projects',
		route: '/projects',
		tileImg: 'm2',
		component: Projects,
		children: [...projectsRoutes],
		bgImgPosition: 'center 100%',
	},
	{
		label: 'Youth Work',
		route: '/youth',
		tileImg: 'blog',
		component: YouthWork,
		bgImgPosition: 'center 0%',
	},
];

export { NavRoute, navRoutes };
