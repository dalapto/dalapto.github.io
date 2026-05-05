import type { BackgroundConfig } from '../../context/BackgroundContext';
import type { Image } from '../../types/basic.types';

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
	alt: "Visual Basic 6's IDE, a blast from the past.",
	caption: "Visual Basic 6's IDE - a blast from the past.",
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
		alt: 'Photo of a lego box mounted on two rails.',
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

const recommendations = {
	books: [
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
	],
	films: [
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
	],
	podcasts: [
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
	],
	tv: [
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
	],
	albums: [
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
	],
};

export {
	archMoveImage,
	edinburghImage,
	litterImages,
	litterTileImage,
	recommendations,
	recyclotronImages,
	recyclotronTileImage,
	uniBackground,
	uniImages,
	vb6IdeImage,
	wallSmileImage,
};
