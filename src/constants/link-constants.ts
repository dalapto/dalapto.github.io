import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import { ExternalLink, TooltipLink } from '../types/basic.types';

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

export { externalLinks, footerLinks };
