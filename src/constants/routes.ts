import { About } from '../pages/About/About';
import { Home } from '../pages/Home/Home';
import { Medieval2TotalWar } from '../pages/Projects/m2tw/m2tw';
import { Projects } from '../pages/Projects/Projects';
import { RiseOfNations } from '../pages/Projects/RON/Ron';
import { YouthWork } from '../pages/YouthWork/YouthWork';

/**
 * Interface for a single route or page.
 */
interface NavRoute {
	label?: string;
	path: string;
	tileImg?: string;
	component?: () => React.ReactNode;
	children?: NavRoute[];
	route?: string;
	onMouseEnter?: (_event: React.MouseEvent<HTMLElement>) => void;
	onClick?: (_event: React.MouseEvent<HTMLElement>) => void;
	onKeyDown?: (_event: React.KeyboardEvent<HTMLElement>) => void;
	isActive?: boolean;
	ariaHasPopup?: boolean;
	ariaExpanded?: boolean;
}

const projectsRoutes: NavRoute[] = [
	{ label: 'Cover Letter Generator', path: 'cover-letter-generator' },
	{ label: 'Clipboard', path: 'clipboard' },
	{ label: 'Litter', path: 'litter' },
	{
		label: 'Medieval 2: Total War',
		path: 'm2tw',
		component: Medieval2TotalWar,
	},
	{ label: 'Rise of Nations', path: 'ron', component: RiseOfNations },
];

const navRoutes: NavRoute[] = [
	{ path: '/', component: Home },
	{ label: 'About', path: '/about', tileImg: 'about', component: About },
	{
		label: 'Projects',
		path: '/projects',
		tileImg: 'm2',
		component: Projects,
		children: [...projectsRoutes],
	},
	{
		label: 'Youth Work',
		path: '/youth',
		tileImg: 'blog',
		component: YouthWork,
	},
];

export { NavRoute, navRoutes };
