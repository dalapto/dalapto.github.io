import type { BackgroundConfig } from '../../context/BackgroundContext';
import type { Image, TooltipLink } from '../../types/basic.types';

const podcasts: TooltipLink[] = [
	{
		text: 'Fall of Civilizations',
		link: 'https://fallofcivilizationspodcast.com/',
		img: 'fall_of_civs.jpg',
	},
	{
		text: 'History of Rome',
		link: 'https://thehistoryofrome.typepad.com/',
		img: 'The_History_of_Rome.png',
	},
	{
		text: 'The Rest is History',
		link: 'https://therestishistory.com/episodes/',
		img: 'rest_is_hist.jpg',
	},
];

const books: TooltipLink[] = [
	{
		text: 'The Great Divorce',
		link: 'https://www.goodreads.com/en/book/show/25845273-the-great-divorce',
		img: 'great.jpg',
	},
	{
		text: 'Name of the Wind',
		link: 'https://www.goodreads.com/en/book/show/186074.The_Name_of_the_Wind',
		img: 'wind.jpg',
	},
	{
		text: 'A Silent Voice',
		link: 'https://www.goodreads.com/book/show/57764673-silent-voice',
		img: 'silent.jpg',
	},
];

const films: TooltipLink[] = [
	{
		text: 'Hunt for the Wilderpeople',
		link: 'https://www.rottentomatoes.com/m/hunt_for_the_wilderpeople',
		img: 'hunt.jpg',
	},
	{
		text: 'Only Yesterday',
		link: 'https://www.rottentomatoes.com/m/only_yesterday_1991',
		img: 'only.jpg',
	},
	{
		text: 'Fifth Element',
		link: 'https://www.rottentomatoes.com/m/fifth_element',
		img: '5th.png',
	},
];

const tv: TooltipLink[] = [
	{
		text: 'Ping Pong the Animation',
		link: 'https://letterboxd.com/film/ping-pong-the-animation/',
		img: 'pingpong1.jpg',
	},
	{
		text: 'Fringe',
		link: 'https://www.rottentomatoes.com/tv/fringe',
		img: 'fringe.png',
	},
	{
		text: 'Bondi Rescue',
		link: 'https://www.rottentomatoes.com/tv/bondi_rescue',
		img: 'bondi.jpg',
	},
];

const albums: TooltipLink[] = [
	{
		text: 'Hold Still',
		link: 'https://open.spotify.com/album/5BiPMSmuINHTP82jz0RE3l',
		img: 'holdstill.jpg',
	},
	{
		text: 'Zeal',
		link: 'https://open.spotify.com/album/1p9qFUWDth0hWAQYiKUB37',
		img: 'zeal.jpg',
	},
	{
		text: 'Suburban Legend',
		link: 'https://open.spotify.com/album/0XBOirwu0hluwBbEb8hdMe',
		img: 'suburb.jpg',
	},
];

const blurb = '(how I became a Software Engineer)';

const vb6Link = {
	text: 'VB6',
	link: 'https://en.wikipedia.org/wiki/Visual_Basic_(classic)',
	img: '/img/logo/vb6.png',
};
const vb6 = `<@${vb6Link.text}@${vb6Link.link}@${vb6Link.img}@>`;

const sdlcLink = {
	text: 'SDLC',
	link: 'https://en.wikipedia.org/wiki/Systems_development_life_cycle',
};
const sdlc = `<@${sdlcLink.text}@${sdlcLink.link}@>`;

const gapYahLink = {
	text: 'gap yah',
	link: 'https://en.wikipedia.org/wiki/Gap_Yah',
};
const gapYah = `<@${gapYahLink.text}@${gapYahLink.link}@>`;

const gapYah2Link = {
	text: '(video)',
	link: 'https://www.youtube.com/watch?v=eKFjWR7X5dU',
};
const gapYah2 = `<@${gapYah2Link.text}@${gapYah2Link.link}@>`;

const edinburghImage: Image = {
	src: 'img/about/edi.jpeg',
	alt: 'The Edinburgh skyline as seen from my halls in first year.',
};

const uniBackground: BackgroundConfig = {
	image: edinburghImage,
	imagePosition: 'center 30%',
	blur: 0.5,
};

const uniImages: Image[] = [
	{
		src: '/img/about/at.jpg',
		alt: 'Outside of Appleton Tower at University of Edinburgh',
		caption: 'Appleton Tower — home of Informatics.',
	},
	{
		src: '/img/about/labs.JPEG',
		alt: 'Me working in the computer labs with a pained expression.',
		caption: "Me working hard in Appleton Tower's labs.",
	},
	{
		src: '/img/about/subs.JPEG',
		alt: 'A meme about auto-generated captions in lecture recordings.',
		caption: "Lecture recordings didn't always have self-annotated captions...",
	},
];

const vb6IdeImage: Image = {
	src: '/img/about/vb6_ide.png',
	alt: "Visual Basic 6's IDE",
};

const recyclotronTileImage: Image = {
	alt: '3D Concept Art of Recyclotron',
	src: '/img/recylotron/3dmodels/onbins.png',
};

const recyclotronImages: Image[] = [
	{
		src: '/img/recylotron/art/concept1.jpg',
		alt: 'Early concept art of the bin chamber.',
		caption: 'Early concept art for the bin chamber.',
	},
	{
		src: '/img/recylotron/3dmodels/icon.png',
		alt: '3D model of the final prototype.',
		caption: 'Model of the final prototype.',
	},
	{
		src: '/img/recylotron/photos/rails_side.jpg',
		alt: 'Photo of the chamber mounted on the bin rails.',
		caption: 'The lego chamber mounted on the bin rails.',
	},
];

const litterTileImage: Image = {
	src: '/img/litter/app/background.png',
	alt: 'LitterApp — location-based litter social media app.',
};

const litterImages: Image[] = [
	{
		src: '/img/litter/smaller/marker_new.png',
		alt: 'Screenshot of user being too far away to read a message on map.',
		caption: 'Messages are geo-tagged to a location.',
	},
	{
		src: '/img/litter/figma/map_mockup.png',
		alt: 'Mockup in Figma showing decoding mechanic',
		caption: 'Mockup in Figma showing decoding mechanic.',
	},
	{
		src: '/img/litter/smaller/editmessage_frag.png',
		alt: 'Screenshot of message UI.',
		caption: 'Users could post, update, like and comment messages.',
	},
];

const wallSmileImage: Image = {
	src: '/img/about/wall-smile.jpeg',
	alt: 'Me smiling next to a sunny wall in Hamburg.',
};

const archMoveImage: Image = {
	src: '/img/about/arch-move.png',
	alt: 'Me standing in an archway looking into sunset in lake district.',
};

const blurbPanelData = {
	title: 'about',
	subtitle: blurb,
	content: [
		`My first real taste of the ${sdlc} was in school.`,
		`Using ${vb6} I built a bookkeeping app for a local book shop 📚`,
		'',
		'I recall spending days to add currency functionality, writing dozens of if-statements...',
		'',
		'Thankfully, that code has been lost to time.',
		'',
		'But it inspired me to switch my university application from Chemistry to Computer Science.',
		"This meant next year was getting my Maths A-level (which I'd skipped) to meet course requirements...",
		'',
		`...so my ${gapYah} ${gapYah2} was spent learning 📐 trigonometry...!`,
	],
};

const uniPanelData = {
	title: 'University',
	content: [
		'',
		"It wasn't until third year, I started enjoying uni.",
		'I had fumbled my first two years, having to resit multiple exams.',
		'I knuckled down, keen for the classes I had chosen.',
		'',
		'Then, come March 2020 - everything stopped. I flew back home, unsure of the future.',
		'When obvious this was no Spring thing, I cancelled the flat lease.',
		"I wouldn't return to Edinburgh until 2 years later.",
		'',
		'It was a good time to finish my degree - I had swapped socialising for studying anyway.',
		'Besides, the Informatics department was (mostly) well equipped to virtually assess.',
		'',
	],
};

const recylotronLink = {
	text: 'Recyclotron',
	link: '/projects/recyclotron',
	img: '/img/recylotron/3dmodels/icon.png',
};
const recylotron = `<@${recylotronLink.text}@${recylotronLink.link}@${recylotronLink.img}@>`;

const recyclotronPanelData = {
	title: 'Recyclotron',
	subtitle: 'auto-sorting bin robot',
	content: [
		'',
		"There was also a 'build-us-a-robot' course.",
		'Our group decided to make an auto-sorting bin.',
		'',
		'We trained a neural-network AI on images of rubbish to classify waste into categories.',
		'',
		`You can learn more on ${recylotron} project page.`,
		'',
	],
};

const litterAppLink = {
	text: 'LitterApp',
	link: '/projects/litter',
	img: '/img/litter/app/logo.png',
};
const litterApp = `<@${litterAppLink.text}@${litterAppLink.link}@${litterAppLink.img}@>`;

const kotlinLink = {
	text: 'Kotlin',
	link: 'https://kotlinlang.org',
	img: '/img/logo/kotlin.png',
};

const kotlin = `<@${kotlinLink.text}@${kotlinLink.link}@${kotlinLink.img}@>`;

const litterPanelData = {
	title: 'LitterApp',
	subtitle: 'Location-based Social Media',
	content: [
		'',
		'My final year project was a software engineering project.',
		`I was to create a Location-based Social Media app, for Android, using ${kotlin}.`,
		'',
		'It felt exactly like the school project that inspired the degree 5 years earlier...',
		'',
		`You can learn more on the ${litterApp} project page.`,
		'',
	],
};

export {
	albums,
	archMoveImage,
	blurb,
	blurbPanelData,
	books,
	edinburghImage,
	films,
	litterImages,
	litterPanelData,
	litterTileImage,
	podcasts,
	recyclotronImages,
	recyclotronPanelData,
	recyclotronTileImage,
	tv,
	uniBackground,
	uniImages,
	uniPanelData,
	vb6IdeImage,
	wallSmileImage,
};
