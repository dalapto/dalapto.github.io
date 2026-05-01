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
		img: 'great_divorce.png',
	},
	{
		text: 'Name of the Wind',
		link: 'https://www.goodreads.com/en/book/show/186074.The_Name_of_the_Wind',
		img: 'name_of_the_wind.jpg',
	},
	{
		text: 'A Silent Voice',
		link: 'https://www.goodreads.com/book/show/57764673-silent-voice',
		img: 'a_silent_voice.jpg',
	},
];

const films = [
	{
		text: 'Hunt for the Wilderpeople',
		link: 'https://www.rottentomatoes.com/m/hunt_for_the_wilderpeople',
		img: 'hunt_for_wilderpeople.jpg',
	},
	{
		text: 'Only Yesterday',
		link: 'https://www.rottentomatoes.com/m/only_yesterday_1991',
		img: 'only_yesterday.png',
	},
	{
		text: 'Fifth Element',
		link: 'https://www.rottentomatoes.com/m/fifth_element',
		img: '5th_element.jpg',
	},
];

const tv = [
	{
		text: "Ping Pong the Animation",
		link: 'https://letterboxd.com/film/ping-pong-the-animation/',
		img: 'pingpong.jpg',
	},
	{
		text: 'Bondi Rescue',
		link: 'https://www.rottentomatoes.com/tv/bondi_rescue',
		img: 'bondi_rescue.png',
	},
	{
		text: 'Battlestar Galactica',
		link: 'https://www.rottentomatoes.com/tv/battlestar-galactica',
		img: 'bsg.jpg',
	},
];


const albums = [
	{
		text: "Hovvdy",
		link: 'https://letterboxd.com/film/ping-pong-the-animation/',
		img: 'hovvdy.jpg',
	},
	{
		text: 'Zeal',
		link: 'https://www.rottentomatoes.com/tv/bondi_rescue',
		img: 'bondi_rescue.png',
	},
	{
		text: 'Suburban Legend',
		link: 'https://www.rottentomatoes.com/tv/battlestar-galactica',
		img: 'bsg.jpg',
	},
];

const blurb = '(how I became a Software Engineer)';

const uni_translations = {
	uni: 'University of Edinburgh',
	subject: 'BSc Computer Science',
	grade: '1st',
	before_uni: [
		'My first real taste of the SDLC was in school.',
		'Using VB6, I built a bookkeeping app for a local book shop, documenting the entire process.',
		'',
		'...I recall spending a couple days writing out two dozen if-statements, just to switch between currencies...',
		'',
		'Thankfully, that code has been lost to time.',
		'',
		'After the fun of building my own app, I switched my university application from Chemistry to Computer Science.',
		'This meant next year was getting my Maths A-level (which I had skipped) to meet course requirements...',
		'',
		'...so my gap year was spent between a call centre job and trigonometry 📐',
	],
	at_uni: [
		'I fumbled first and second year of uni, having to resit multiple exams.',
		'Every course was boring and hard. I often fell asleep in morning lectures.',
		'But those two years taught me the life-skills I needed to study well.',
		'',
		'So, come year 3, I knew how to knuckle down.',
		'It helped that, not only did courses now count towards my final grade, but I could choose areas I was actually interested in.',
		'I was invested.',
		'',
		'Then, come March 2020 - everything stopped. I flew back home, unsure what this coronavirus pandemic meant.',
		'When it became obvious this was no Spring thing, I cancelled the flat lease, unsure when I would return.',
		"My brother came to sort through all my things I had left behind. I wouldn't see them for another 2 years.",
		'',
		'It was a good time to finish my degree.',
		'I had swapped socialising for studying and besides, the Informatics department was well equipped to virtually assess.',
		'Even if most lecturers recycled their old lecture recordings...',
	],
	recyclotron: {
		title: 'Recyclotron',
		content:
			"There was also a 'build-us-a-robot' course. Our group decided to make an auto-sorting bin. We trained our NN AI on images of rubbish. As I had 4 other courses on-the-go, I decided to manage the team of ten and writeup reports. We had some smart cookies.",
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

export { blurb, podcasts, uni_translations };
