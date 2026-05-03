const podcasts = [
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

const books = [
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

const films = [
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

const tv = [
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

const albums = [
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

const uni_translations = {
	before_uni: [
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
	uni1: [
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
	ilp: {
		title: '',
		content: '',
	},
	recyclotron: {
		title: 'Recyclotron',
		content: [
			"There was also a 'build-us-a-robot' course. Our group decided to make an auto-sorting bin. We trained our NN AI on images of rubbish. As I had 4 other courses on-the-go, I decided to manage the team of ten and writeup reports. We had some smart cookies.",
		],
	},
	litter: {
		title: 'Litter',
		subtitle: 'Location-based Social Media App',
		content: [
			'One course in third year was creating a rules-based pathfinding AI in Java. This was a hoot and I wondered if I could expand on this for my final year project...',
			'Luckily for me the course lecturer had such a project!',
			'I was to create a location-based social media app, using Kotlin. I go into more detail here. It was a lot of fun.',
		],
	},
};

export { albums, blurb, books, films, podcasts, tv, uni_translations };
