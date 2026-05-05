import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import { ExternalLink, TooltipLink } from '../types/basic.types';

const vb6Link = {
	text: 'VB6',
	link: 'https://en.wikipedia.org/wiki/Visual_Basic_(classic)',
	img: '/img/logo/vb6.png',
};

const sdlcLink = {
	text: 'SDLC',
	link: 'https://en.wikipedia.org/wiki/Systems_development_life_cycle',
};

const gapYahLink = {
	text: 'gap yah',
	link: 'https://en.wikipedia.org/wiki/Gap_Yah',
};

const gapYah2Link = {
	text: '(video)',
	link: 'https://www.youtube.com/watch?v=eKFjWR7X5dU',
};

const recylotronLink = {
	text: 'Recyclotron',
	link: '/recyclotron',
	img: '/img/recylotron/3dmodels/icon.png',
};

const litterAppLink = {
	text: 'LitterApp',
	link: '/litterapp',
	img: '/img/litter/app/logo.png',
};

const kotlinLink = {
	text: 'Kotlin',
	link: 'https://kotlinlang.org',
	img: '/img/logo/kotlin.png',
};

const linkedinProfileLink = {
	text: 'LinkedIn',
	link: 'https://www.linkedin.com/in/david-mcalister/details/experience/',
};

const externalLinks: ExternalLink[] = [
	{
		href: 'https://www.linkedin.com/in/david-mcalister/',
		label: 'LinkedIn',
		icon: LinkedInIcon,
	},
	{
		href: 'https://github.com/dalapto',
		label: 'GitHub',
		icon: GitHubIcon,
	},
];

const footerLinks: TooltipLink[] = [
	{ text: 'Vite', link: 'https://vitejs.dev/', img: 'vite.png' },
	{ text: 'React', link: 'https://react.dev/', img: 'react.webp' },
	{
		text: 'TypeScript',
		link: 'https://www.typescriptlang.org/',
		img: 'ts.png',
	},
	{ text: 'Material UI', link: 'https://mui.com/', img: 'mui.png' },
	{ text: 'GitHub Pages', link: 'https://pages.github.com/', img: 'gh.png' },
];

export {
	externalLinks,
	footerLinks,
	gapYah2Link,
	gapYahLink,
	kotlinLink,
	linkedinProfileLink,
	litterAppLink,
	recylotronLink,
	sdlcLink,
	vb6Link,
};
