import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import { LITTER_APP_PATH, RECYCLOTRON_PATH } from './route-paths';
import { ExternalLink, TooltipLink } from '../types/basic.types';
import { ImgPaths } from './img-paths';

/** Encodes a TooltipLink (or plain link) into the <@text@href@img@> format used by FormattedText. */
function formatLink({
	text,
	link,
	img = '',
}: {
	text: string;
	link: string;
	img?: string;
}): string {
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
	link: RECYCLOTRON_PATH,
	img: ImgPaths.pages.recylotron.models.icon,
};

const litterAppLink = {
	text: 'LitterApp',
	link: LITTER_APP_PATH,
	img: ImgPaths.pages.litter.app.logo,
};

const kotlinLink = {
	text: 'Kotlin',
	link: 'https://kotlinlang.org',
	img: ImgPaths.logo.kotlin,
};

const javaLink = {
	text: 'Java',
	link: 'https://www.java.com/en/download/help/whatis_java.html',
	img: ImgPaths.logo.java,
};

const powergrabLink = {
	text: 'here',
	link: 'https://github.com/dalapto/uni-powergrab',
};

const litterAppGithubLink = {
	text: 'here',
	link: 'https://github.com/dalapto/uni-litterapp',
};

const aStarLink = {
	text: 'A* search algorithm',
	link: 'https://en.wikipedia.org/wiki/A*_search_algorithm',
};

const pokemonLink = {
	text: 'Pokémon Go',
	link: 'https://pokemongo.com/en/map',
	img: ImgPaths.logo.pokemon,
};

const geocachingLink = {
	text: 'Geocaching',
	link: 'https://www.geocaching.com/sites/education/en/frequently-asked-questions/',
	img: ImgPaths.logo.geocaching,
};

const figmaLink = {
	text: 'Figma',
	link: 'https://www.figma.com/',
	img: ImgPaths.logo.figma,
};

const cloudFirestoreLink = {
	text: 'Cloud Firestore',
	link: 'https://firebase.google.com/docs/firestore',
	img: ImgPaths.logo.firebase,
};

const sqlLink = {
	text: 'SQL',
	link: 'https://en.wikipedia.org/wiki/SQL',
};

const noSqlLink = {
	text: 'NoSQL',
	link: 'https://en.wikipedia.org/wiki/NoSQL',
};

const crudLink = {
	text: 'CRUD',
	link: 'https://en.wikipedia.org/wiki/Create,_read,_update_and_delete',
};

const apiLink = {
	text: 'API',
	link: 'https://en.wikipedia.org/wiki/API',
};

const userJourneyLink = {
	text: 'User Journey',
	link: 'https://en.wikipedia.org/wiki/User_journey',
};

const androidStudioLink = {
	text: 'Android Studio',
	link: 'https://developer.android.com/studio',
};

const emulatorLink = {
	text: 'emulator',
	link: 'https://en.wikipedia.org/wiki/Emulator',
};

const googleMapsSDKLink = {
	text: 'Google Maps SDK for Android',
	link: 'https://developers.google.com/maps/documentation/android-sdk',
};

const typescriptLink = {
	text: 'TypeScript',
	link: 'https://www.typescriptlang.org/',
	img: ImgPaths.logo.ts,
};

const javascriptLink = {
	text: 'JavaScript',
	link: 'https://en.wikipedia.org/wiki/JavaScript',
};

const jvmLink = {
	text: 'JVM',
	link: 'https://en.wikipedia.org/wiki/Java_virtual_machine',
};

const compilerLink = {
	text: 'compile',
	link: 'https://en.wikipedia.org/wiki/Compiler',
};

const androidLink = {
	text: 'Android',
	link: 'https://www.android.com/intl/en_uk/why-android/',
	img: ImgPaths.logo.android,
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
	{
		text: 'TypeScript',
		link: 'https://www.typescriptlang.org/',
		img: ImgPaths.logo.ts,
	},
	{ text: 'Material UI', link: 'https://mui.com/', img: ImgPaths.logo.mui },
	{
		text: 'GitHub Pages',
		link: 'https://pages.github.com/',
		img: ImgPaths.logo.gh,
	},
];

export {
	androidLink,
	androidStudioLink,
	apiLink,
	aStarLink,
	cloudFirestoreLink,
	compilerLink,
	crudLink,
	emulatorLink,
	externalLinks,
	figmaLink,
	footerLinks,
	formatLink,
	gapYah2Link,
	gapYahLink,
	geocachingLink,
	googleMapsSDKLink,
	javaLink,
	javascriptLink,
	jvmLink,
	kotlinLink,
	linkedinProfileLink,
	litterAppGithubLink,
	litterAppLink,
	noSqlLink,
	pokemonLink,
	powergrabLink,
	projectsLink,
	recylotronLink,
	sdlcLink,
	sqlLink,
	typescriptLink,
	userJourneyLink,
	vb6Link,
};
