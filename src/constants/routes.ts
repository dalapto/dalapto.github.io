import { Temp } from "../components/common/Temp/Temp";
import { About } from "../pages/About/About";
import { Home } from "../pages/Home/Home";
import { Medieval2TotalWar } from "../pages/Projects/m2tw/m2tw";
import { Projects } from "../pages/Projects/Projects";
import { RiseOfNations } from "../pages/Projects/RON/Ron";
import { YouthWork } from "../pages/YouthWork/YouthWork";

interface NavRoute {
	label?: string;
	path: string;
	tileImg?: string;
	parent?: string;
	component?: () => React.ReactNode;
}

const navRoutes: NavRoute[] = [
	{ path: '/', component: Home },
	{ label: 'About', path: '/about', tileImg: 'about', component: About },
	{ label: 'Projects', path: '/projects', tileImg: 'm2', component: Projects },
	{ label: 'Youth Work', path: '/youth', tileImg: 'blog', component: YouthWork },
	{ label: 'Vue Face Labeller', path: 'vue', parent: 'Projects'},
	{ label: 'Litter', path: 'litter', parent: 'Projects'},
	{ label: 'Medieval 2: Total War', path: 'm2tw', parent: 'Projects', component: Medieval2TotalWar },
	{ label: 'Rise of Nations', path: 'ron', parent: 'Projects', component: RiseOfNations },
];


export { navRoutes, NavRoute };