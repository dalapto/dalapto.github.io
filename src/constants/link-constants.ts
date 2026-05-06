import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import { ExternalLink, TooltipLink } from '../types/basic.types';
import { ImgPaths } from './img-paths';

/** Encodes a TooltipLink (or plain link) into the <@text@href@img@> format used by FormattedText. */
function formatLink({ text, link, img = '' }: { text: string; link: string; img?: string }): string {
	return `<@${text}@${link}@${img}@>`;
}

const vb6Link = {
	text: 'VB6',
	link: 'https://en.wikipedia.org/wiki/Visual_Basic_(classic)',
	img: ImgPaths.logo.vb6,
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
	img: ImgPaths.pages.recylotron.models.icon,
};

const litterAppLink = {
	text: 'LitterApp',
	link: '/litterapp',
	img: ImgPaths.pages.litter.app.logo,
};

const kotlinLink = {
	text: 'Kotlin',
	link: 'https://kotlinlang.org',
	img: ImgPaths.logo.kotlin,
};

const linkedinProfileLink = {
	text: 'LinkedIn',
	link: 'https://www.linkedin.com/in/david-mcalister/details/experience/',
};

const projectsLink = {
	text: 'Projects',
	link: '/projects',
	img: ImgPaths.pages.home.tile.m2,
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
	{ text: 'Vite', link: 'https://vitejs.dev/', img: ImgPaths.logo.vite },
	{ text: 'React', link: 'https://react.dev/', img: ImgPaths.logo.react },
	{ text: 'TypeScript', link: 'https://www.typescriptlang.org/', img: ImgPaths.logo.ts },
	{ text: 'Material UI', link: 'https://mui.com/', img: ImgPaths.logo.mui },
	{ text: 'GitHub Pages', link: 'https://pages.github.com/', img: ImgPaths.logo.gh },
];

export {
	externalLinks,
	footerLinks,
	formatLink,
	gapYah2Link,
	gapYahLink,
	kotlinLink,
	linkedinProfileLink,
	litterAppLink,
	projectsLink,
	recylotronLink,
	sdlcLink,
	vb6Link,
};
